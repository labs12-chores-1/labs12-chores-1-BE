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




module.exports = taskHistoryRouter;