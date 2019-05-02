const express = require('express');
const taskHistoryRouter = express.Router();
const taskHistoryDb = require('../../helpers/taskHistoryModel');
const taskDB = require('../../helpers/taskModel');

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
    //console.log('history', taskHistory)
    if(!taskHistory.taskID ) return res.status(404).json({message: `taskID does not exist or is invalid.`});
    if(!taskHistory.userID  ) return res.status(404).json({message: `userID does not exist or is invalid.`});
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
        // iterate over each history and collect username and task

        for(let i = 0; i < hist.length; i++){
            userDb.getById(hist[i].userID).then(user => {
                // collect username of trip // ---------------------- DOUBLE CHECK LOGIC
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
taskHistoryRouter.get('/gettaskhistory/', (req, res) => {
    let taskHistory = req.body;
    if(!taskHistory.groupID || typeof(taskHistory.groupID) !== 'number') return res.status(404).json({message: `groupID does not exist or is invalid.`});
    if(!taskHistory.userID || typeof(taskHistory.userID) !== 'number') return res.status(404).json({message: `userID does not exist or is invalid.`});
    groupHistoryDb.getById(taskHistory.groupID, taskHistory.userID).then(taskHistories => {
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


module.exports = taskHistoryRouter;