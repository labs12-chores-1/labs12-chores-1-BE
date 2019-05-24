const express = require('express');
const commentRouter = express.Router();
const commentDb = require('../../helpers/commentModel');
const notificationDb = require('../../helpers/notificationsModel');
const groupDb = require('../../helpers/groupModel');
const userDb = require('../../helpers/userModel');

const checkJwt = require('../../validators/checkJwt');
const checkUser = require('../../validators/checkUser');
// checkJwt middleware authenticates user tokens and ensures they are signed correctly in order to access our internal API
const moment = require('moment');

var Pusher = require('pusher');

var pusher = new Pusher({
    appId: process.env.PUSHER_APP_ID,
    key: process.env.PUSHER_KEY,
    secret: process.env.PUSHER_SECRET,
    cluster: process.env.PUSHER_CLUSTER,
    encrypted: true
  });

  const PushNotifications = require('@pusher/push-notifications-server');

  let beamsClient = new PushNotifications({
    instanceId: process.env.BEAMS_INSTANCE_ID,
    secretKey: process.env.BEAMS_SECRET_KEY
  });


/****************************************************************************************************/
/** THIS ROUTER HANDLES ALL REQUESTS TO THE /api/comment ENDPOINT **/
/****************************************************************************************************/

/** ADD COMMENT TO DATABASE
 * @param comment = {commentString: the comment string, taskID: id of task it belongs to, groupID: id of group it belongs to, commentedBy: id of user it belongs to}, this is gathered from the @param req.body
 * @return id = Comment ID primary key in comments table (e.g. 1, 3, 22, etc.);
 * ID is generated upon comment creation
 * @param comment.commentString is the comment string. Not nullable.
 * @param comment.taskID is the id of the task. Not nullable.
 * @param comment.groupID is the id of the group. Not nullable.
 * @param comment.commentedBy is the user who commented the comment. Not Nullable.
 * @param comment.commentedOn is the date that the comment was commented on. Nullable.
 *
 * ***********************************************/

commentRouter.use(checkJwt);

/** ADD COMMENT
 * @TODO Add middleware to ensure user is logged in
 * /** Each time an comment is added to a group, a notification should fire for that group's channel
         * Additionally, the event should be stored into the notifications table for future review
         * The notifications table will need to contain a record of the:
         *      commentedBy
         *      groupId
         *      time of action
         *      type of action
         *      
         */
commentRouter.post('/', (req, res) => {
    const comment = req.params;
    let groupID = comment.groupID;
    let commentedBy = comment.commentedBy;

    commentDb.add(comment).then(id => {
        // console.log(`Comment ID: ${id} is successfully added to the comment DB!`);
        // return res.status(200).json({message: "Comment added.", id: id});
    
        //Remove ShopTrak codes for notifications, for now
    //************************************************************************
        // get group and user information for notification
        // we can assume the user in req.user is performing this action via checkJwt
        let notification = {};
        // can we abstract this into a function?
        userDb.getProfileByEmail(req.user.email).then(user => {
            notification.commentedBy = user[0].id;
            notification.userName = user[0].name;

            groupDb.getById(groupID).then(group => {
                notification.groupID = group[0].id;
                notification.groupName = group[0].name;
                notification.action = 'add-comment';
                notification.content = `${notification.userName} added ${comment.name} to the ${notification.groupName} task list.`

                pusher.trigger(`group-${groupID}`, 'add-comment', {
                    "message": `${notification.userName} added ${comment.name} to the ${notification.groupName} task list.`,
                    "timestamp": moment().format()
                })

                beamsClient.publishToInterests([`group-${groupID}`], {
                    apns: {
                        aps: {
                            alert: notification.content
                        }
                    },
                    fcm: {
                        notification: {
                            title: `New Comment Added`,
                            body: notification.content
                        }
                    }
                }).then((publishResponse) => {
                    console.log('comment notification', publishResponse.publishId);
                }).catch((error) => {
                    console.log('error', error);
                })

                console.log('NOTIFICATION\n\n', notification);

                notificationDb.add(notification).then(response => {
                    console.log('notification added', response);
                    return res.status(200).json({message: `Comment successfully added`, id: id[0]});
                })
            })
        })     
        //*******************************************************************   
    }).catch(err => {
        console.log(err);
        return res.status(500).json(err);
        })
})

/**************************************************/

/** GET COMMENT BY ID
 * @TODO Add middleware to ensure user is logged in
 * **/

/**************************************************/
commentRouter.get('/:id', (req, res) => {
    const id = req.params.id;

    commentDb.getById(id).then(comment => {
        if (comment.length >= 1) {
            return res.status(200).json({data: comment})
        }

        return res.status(404).json({message: "The requested comment does not exist."});
    })
        .catch(err => {
            const error = {
                message: `Internal Server Error - Retrieving Comment`,
                data: {
                    err: err
                },
            }
            return res.status(500).json(error);
        })
})

/**************************************************/

/** GET COMMENT BY GROUP ID
 * @TODO Add middleware to ensure user is logged in
 * **/

/**************************************************/
commentRouter.get('/group/:id', (req, res) => {
    const id = req.params.id;

    commentDb.getByGroup(id).then(comment => {
        if (comment.length >= 1) {
            return res.status(200).json({data: comment})
        }

        return res.status(404).json({message: "The requested comment does not exist."});
    })
        .catch(err => {
            const error = {
                message: `Internal Server Error - Retrieving Comment`,
                data: {
                    err: err
                },
            }
            return res.status(500).json(error);
        })
})

/**************************************************/

/** GET COMMENT BY USER ID
 * @TODO Add middleware to ensure user is logged in
 * **/

/**************************************************/
commentRouter.get('/user/:id', (req, res) => {
    const id = req.params.id;

    commentDb.getByUser(id).then(comment => {
        if (comment.length >= 1) {
            return res.status(200).json({data: comment})
        }

        return res.status(404).json({message: "The requested comment does not exist."});
    })
        .catch(err => {
            const error = {
                message: `Internal Server Error - Retrieving Comment`,
                data: {
                    err: err
                },
            }
            return res.status(500).json(error);
        })
})

/**************************************************/

/** GET COMMENT BY TASK ID
 * @TODO Add middleware to ensure user is logged in
 * **/

/**************************************************/
commentRouter.get('/task/:id', (req, res) => {
    const id = req.params.id;

    commentDb.getByTask(id).then(comment => {
        if (comment.length >= 1) {
            return res.status(200).json({data: comment})
        }

        return res.status(404).json({message: "The requested comment does not exist."});
    })
        .catch(err => {
            const error = {
                message: `Internal Server Error - Retrieving Comment`,
                data: {
                    err: err
                },
            }
            return res.status(500).json(error);
        })
})


/**************************************************/

// GET ALL COMMENTS
/** @TODO This should be set to sysadmin privileges for subscription privacy **/

/**************************************************/

commentRouter.get('/', (req, res) => {
    commentDb.get().then(comments => {
        if(comments.length >= 1) {
            return res.status(200).json({data: comments});
        }

        return res.status(404).json({message: `The requested comments do not exist.`})
    })
        .catch(err => {
            const error = {
                message: `Internal Server Error - Getting comments`,
                data: {
                    err: err
                },
            }
            return res.status(500).json(error);
        })
})

/**************************************************/
/**
 * UPDATE ITEM
 * @TODO Add middleware to ensure users can only change their own group information
 */

/**************************************************/
commentRouter.put('/:id', (req, res) => {
    let id = req.params.id;
    let changes = req.body;
    // changes.price = parseFloat(changes.price);
    console.log('id, changes', id, changes);
    commentDb.getById(id).then(comment => {
        let oldComment = comment[0];

        commentDb.update(id, changes).then(status => {
            console.log('comment update', status);

            if (status.length >= 1 || status === 1) {
                    let notification = {};
                    userDb.getProfileByEmail(req.user.email).then(user => {
                        notification.userID = user[0].id;
                        notification.userName = user[0].name;
        
                        commentDb.getById(id).then(newComment => {
                            let groupID = newComment[0].groupID;
        
                            groupDb.getById(groupID).then(group => {
                                notification.groupID = group[0].id;
                                notification.groupName = group[0].name;
                                notification.action = 'update-comment';
                                notification.content = `${notification.userName} updated ${oldComment.name} to ${newComment[0].name} in the ${notification.groupName} task list.`
        
                                pusher.trigger(`group-${groupID}`, 'update-comment', {
                                    "message": `${notification.userName} updated ${oldComment.name} to ${newComment[0].name} in the ${notification.groupName} task list.`,
                                    "timestamp": moment().format()
                                })

                                beamsClient.publishToInterests([`group-${groupID}`], {
                                    apns: {
                                        aps: {
                                            alert: notification.content
                                        }
                                    },
                                    fcm: {
                                        notification: {
                                            title: `Comment Updated`,
                                            body: notification.content
                                        }
                                    }
                                }).then((publishResponse) => {
                                    console.log('comment notification', publishResponse.publishId);
                                }).catch((error) => {
                                    console.log('error', error);
                                })
        
                                console.log('NOTIFICATION\n\n', notification);
        
                                notificationDb.add(notification).then(response => {
                                    console.log('notification added', response);
                                    return res.status(200).json({message: "Comment updated successfully", id: status[0]})                                    
                                })
                            })
                        })
                    })
                } else {
                    return res.status(404).json({message: "The requested comment does not exist."});
                }
        })
    })
        .catch(err => {
            const error = {
                message: `Internal Server Error - Updating Comment`,
                data: {
                    err: err
                },
            }
            return res.status(500).json(error);
        })
})

/**************************************************/

/** DELETE COMMENT
 * @TODO Add middleware to prevent unauthorized deletions
 * **/

/**************************************************/

commentRouter.delete('/:id', (req, res) => {
    const id = req.params.id;
    commentDb.getById(id).then(comment => {
        let groupID = comment[0].groupID;
        let oldComment = comment[0];
        return commentDb.remove(id).then(status => {
            // console.log('remove status', status)
            if (status.length >= 1 || status === 1) {
                return res.status(200).json({message: "Comment removed successfully", id: status[0]});
                // let notification = {};
                //     userDb.getProfileByEmail(req.user.email).then(user => {
                //         notification.commentedBy = user[0].id;
                //         notification.userName = user[0].name;
        
                //             groupDb.getById(groupID).then(group => {
                //                 notification.groupID = group[0].id;
                //                 notification.groupName = group[0].name;
                //                 notification.action = 'delete-comment';
                //                 notification.content = `${notification.userName} removed ${oldComment.name} from the ${notification.groupName} task list.`
        
                //                 pusher.trigger(`group-${groupID}`, 'delete-comment', {
                //                     "message": `${notification.userName} removed ${oldItem.name} from the ${notification.groupName} task list.`,
                //                     "timestamp": moment().format()
                //                 })

                //                 beamsClient.publishToInterests([`group-${groupID}`], {
                //                     apns: {
                //                         aps: {
                //                             alert: notification.content
                //                         }
                //                     },
                //                     fcm: {
                //                         notification: {
                //                             title: `Comment Deleted`,
                //                             body: notification.content
                //                         }
                //                     }
                //                 }).then((publishResponse) => {
                //                     console.log('comment notification', publishResponse.publishId);
                //                 }).catch((error) => {
                //                     console.log('error', error);
                //                 })
        
                //                 console.log('NOTIFICATION\n\n', notification);
        
                //                 notificationDb.add(notification).then(response => {
                //                     console.log('notification added', response);
                //                     return res.status(200).json({message: "Comment removed successfully", id: status[0]})                               
                //                 })
                //             })
                //         })
            } else {
                return res.status(404).json({message: "The requested comment does not exist."});
            }

        })
    })
            .catch(err => {
                const error = {
                    message: `Internal Server Error - Removing Comment`,
                    data: {
                        err: err
                    },
                }
                return res.status(500).json(error);
            })
})

module.exports = commentRouter;