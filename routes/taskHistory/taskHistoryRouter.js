const express = require('express');
const taskHistoryRouter = express.Router();
const taskHistoryDb = require('../../helpers/taskHistoryModel');
const taskDb = require('../../helpers/taskModel');

const userDb = require('../../helpers/userModel');
const moment = require('moment');

const checkJwt = require('../../validators/checkJwt');
taskHistoryRouter.use(checkJwt);

//checkJwt middleware authenticates user tokens and ensures they are signed correctly in order to access our internal API

/****************************************************************************************************/
/** THIS ROUTER HANDLES ALL REQUESTS TO THE /api/taskhistory ENDPOINT **/
/****************************************************************************************************/

/** ADD TASK HISTORY TO DATABASE
 *  need to update this section once working
 *
 * ***********************************************/

/** ADD TASK HISTORY
 * @TODO Add middleware to ensure user is logged in
 * **/
taskHistoryRouter.post('/', (req, res) => {
    const taskHistory  = req.body;
    // return res.status(404).json({message: `task history type: ${typeof(taskHistory.taskID)}`});
    if(!taskHistory.taskID || typeof(taskHistory.taskID) !== 'number' ) return res.status(404).json({message: `taskID does not exist or is invalid.`});
    if(!taskHistory.userID || typeof(taskHistory.userID) !== 'number' ) return res.status(404).json({message: `userID does not exist or is invalid.`});
    //console.log("COR");
    taskHistoryDb.add(taskHistory).then(id => {
        //console.log(id, 'id');
        if(id >= 1){
            return res.status(200).json({message: `task history added.`, id: id[0]});
        }
        return res.status(400).json({message: `Failed to add.`});
    })
        .catch(err => {
            //console.log(err);
            const error = {
                message: `Internal Server Error - Adding task History`,
                data: {
                    err: err
                },
            }
            return res.status(500).json(error);
        });
});

/**************************************************/

/** GET TASK HISTORY BY GROUP ID
 * @TODO Add middleware to ensure user is logged in
 * **/

/**************************************************/
/*
 * Groups the array by user and date
 * @params array - Array to sort
 * @params f - What to sort by
 */

// function groupBy( array , f )
// {
//     // Set a new group object
//     var groups = {};

//     // Loop through the array and start sorting based on the f inputs
//     array.forEach( function( o )
//     {
//         var group = JSON.stringify( f(o) );
//         groups[group] = groups[group] || [];
//         groups[group].push( o );
//     });

//     // Return a new array of groups
//     return Object.keys(groups).map( function( group )
//     {
//         return groups[group];
//     })
// }

taskHistoryRouter.get('/group/:id', async (req, res) => {
    // get group task histories
    let groupID = req.params.id;

    taskHistoryDb.getByGroup(groupID).then(hist => {
        // iterate over each task history and collect username and task

        for(let i = 0; i < hist.length; i++){
            userDb.getById(hist[i].userID).then(user => {
                // collect username of task 
                if(!user || user.length === 0){
                    hist[i].userName = 'Removed User';
                } else {
                    hist[i].userName = user[0].name;
                }
                /**
                 * Compares two object properties returning true or false
                 * @param x - first object property
                 * @param y - second object property
                 * @returns {boolean}
                 * @constructor
                 */
                function CompareObjProperties(x, y) {
                    for (var prop in x) {
                        for (var prop in y) {
                            if (x !== y) {
                                return false;
                            }
                        }
                    }
                    return true;
                }

                taskDb.getByGroup(groupID).then(task => {
                    if(!hist[i].completedTask){
                        // initialize an array for the completed task
                        hist[i].completedTask = [];
                    }
                    for(let j = 0; j < task.length; j++){
                        const isString = CompareObjProperties(hist[i].completedOn, task[j].completedOn);
                        if(isString && task[j].completedOn !== null){
                            hist[i].completedTask.push(task[j]);
                        }
                    }
                    hist[i].dateString = moment(hist[i].completedOn).format('LLLL')

                    if(i === hist.length - 1){
                        // console.log('loop complete', hist);
                        return res.status(200).json({data: hist});
                    }
                })
            })
        }
    }).catch(err => {
        console.log(err);
        return res.status(500).json({error: `Internal Server Error`})
    })
})

/**************************************************/

/** GET TASK HISTORY BY USER ID
 * @TODO Add middleware to ensure user is logged in
 * **/

/**************************************************/
taskHistoryRouter.get('/user/:id', (req, res) => { //----------------DOUBLE CHECK
    const userId = req.params.id;
    taskHistoryDb.getByUser(userId).then(taskHistories => {
        if (taskHistories.length >= 1) {
            return res.status(200).json({data: taskHistories});
        }
        return res.status(404).json({message: "The requested task histories do not exist."});
    })
        .catch(err => {
            const error = {
                message: `Internal Server Error - Getting Task History`,
                data: {
                    err: err
                },
            }
            return res.status(500).json(error);
        });
});

/**************************************************/

/** GET TASK HISTORY BY USER && GROUP ID
 * @TODO Add middleware to ensure user is logged in
 * **/

/**************************************************/
taskHistoryRouter.get('/gettaskhistory/', (req, res) => { //--------HAVE SOMEONE TEST : TYPEOF DELETED
    let taskHistory = req.body;
    if(!taskHistory.groupID ) return res.status(404).json({message: `groupID does not exist or is invalid.`});
    if(!taskHistory.userID ) return res.status(404).json({message: `userID does not exist or is invalid.`});
    taskHistoryDb.getById(taskHistory.groupID, taskHistory.userID).then(taskHistories => {
        if (taskHistories.length >= 1) {
            return res.status(200).json({data: taskHistories});
        }
        return res.status(404).json({message: "The requested task histories do not exist."});
    })
        .catch(err => {
            const error = {
                message: `Internal Server Error - Getting tsak Histories`,
                data: {
                    err: err
                },
            }
            return res.status(500).json(error);
        });
});

/**************************************************/

// GET ALL TASK HISTORIES -------------- FOR ADMIN ---- --------------- DOUBLE CHECK
/** @TODO This should be set to sysadmin privileges for group privacy **/

/**************************************************/

taskHistoryRouter.get('/', (req, res) => {  
    taskHistoryDb.get().then(taskHistories => {
        if(taskHistories){
            return res.status(200).json({data: taskHistories});
        }
        return res.status(404).json({error: `No task histories exist.`});
    })
        .catch(err => {
            const error = {
                message: `Internal Server Error - Getting All Task Histories`,
                data: {
                    err: err
                },
            }
            return res.status(500).json(error);
        });
});


/**************************************************/
/**
 * UPDATE TASK HISTORY
 * @TODO Add middleware to ensure users can only change their own task information
 */

/**************************************************/

taskHistoryRouter.put('/update/:id', (req, res) => {
    const id = req.params.id;
    const changes = req.body;
    taskHistoryDb.update(id, changes).then(status => {
        console.log(status);
        if (status >= 1) {
            return res.status(200).json({message: "Task History successfully updated.", id: Number(id)});
        }
        return res.status(400).json({message: "Failed to update."});
    })
        .catch(err => {
            const error = {
                message: `Internal Server Error - Updating Task History`,
                data: {
                    err: err
                },
            }
            return res.status(500).json(error);
        });
});

/**************************************************/

/** DELETE TASK HISTORY BY TASK ID
 * @TODO Add middleware to prevent unauthorized deletions
 * **/

/**************************************************/

taskHistoryRouter.delete('/remove/:id', (req, res) => {
    const id = req.params.id;
    taskHistoryDb.remove(id).then(status => {
        if (status >= 1) {
            return res.status(200).json({message: "Task History successfully removed.", id: Number(id)})
        }
        return res.status(400).json({message: "Failed to delete."});
    })
        .catch(err => {
            const error = {
                message: `Internal Server Error - Removing Task History`,
                data: {
                    err: err
                },
            }
            return res.status(500).json(error);
        });
});

/**************************************************/

/** GET TASK HISTORIES IDs BY USER ID
 * @TODO Add middleware to prevent unauthorized deletions
 * **/

/**************************************************/

taskHistoryRouter.get('/user/:id', (req, res) => {
    const userId = req.params.id;
    taskHistoryDb.returnUserGroups(userId).then(status => {
        if (status >= 1) {
            return res.status(200).json({message: "Task History's group ID's successfully acquired.", id: Number(id)});
        }
        return res.status(400).json({message: "Failed to get task history."});
    })
        .catch(err => {
            const error = {
                message: `Internal Server Error - Getting Task History Group ID's`,
                data: {
                    err: err
                },
            }
            return res.status(500).json(error);
        });
});

taskHistoryRouter.get('/all/group/:id', (req, res) => { //-----------------Double Check
    let groupID = req.params.id;

    taskHistoryDb.getByGroup(groupID).then(data => {
        return res.status(200).json({data})
    }).catch(err => {
        console.log(err);
        return res.status(500).json({error: `Internal server error.`})
    })
})


module.exports = taskHistoryRouter;