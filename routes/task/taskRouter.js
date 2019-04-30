const express = require('express');
const taskRouter = express.Router();
const taskDb = require('../../helpers/taskModel');
const notificationDb = require('../../helpers/notificationsModel');
const groupDb = require('../../helpers/groupModel');
const userDb = require('../../helpers/userModel');

const checkJwt = require('../../validators/checkJwt');
const checkUser = require('../../validators/checkUser');

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
/** THIS ROUTER HANDLES ALL REQUESTS TO THE /api/task ENDPOINT **/
/****************************************************************************************************/

taskRouter.use(checkJwt);

/** ADD TASK
 * @TODO Add middleware to ensure user is logged in
 * /** Each time an task is added to a group, a notification should fire for that group's channel
         * Additionally, the event should be stored into the notifications table for future review
         * The notifications table will need to contain a record of the:
         *      userID
         *      groupID
         *      time of action
         *      type of action
         *      
         */
taskRouter.post('/', (req, res) => {
    const task = req.body;
    let groupID = task.groupID;

    taskDb.add(task).then(id => {
        // get group and user information for notification
        // we can assume the user in req.user is performing this action via checkJwt
        let notification = {};
        // can we abstract this into a function?
        userDb.getProfileByEmail(req.user.email).then(user => {
            notification.userID = user[0].id;
            notification.userName = user[0].name;

            groupDb.getById(groupID).then(group => {
                notification.groupID = group[0].id;
                notification.groupName = group[0].name;
                notification.action = 'add-task';
                notification.content = `${notification.userName} added ${task.name} to the ${notification.groupName} shopping list.`

                pusher.trigger(`group-${groupID}`, 'add-task', {
                    "message": `${notification.userName} added ${task.name} to the ${notification.groupName} shopping list.`,
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
                            title: `New Task Added`,
                            body: notification.content
                        }
                    }
                }).then((publishResponse) => {
                    console.log('task notification', publishResponse.publishId);
                }).catch((error) => {
                    console.log('error', error);
                })

                console.log('NOTIFICATION\n\n', notification);

                notificationDb.add(notification).then(response => {
                    console.log('notification added', response);
                    return res.status(200).json({message: `Task successfully added`, id: id[0]});
                })
            })
        }) 
    }).catch(err => {
        console.log(err);
        return res.status(500).json(err);
        })
})  
module.exports = taskRouter;
