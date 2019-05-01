const express = require('express');
const apiRouter = express.Router();

// imports the router for '/user' endpoints
const userRouter = require('./user/userRouter');

// const authRouter = require('./auth/authRouter');

// imports the router for '/group' endpoints
const groupRouter = require('./group/groupRouter');

// imports the router for '/comment' endpoints
const commentRouter = require('./comment/commentRouter');

// imports the router for '/subscription' endpoints
const subscriptionRouter = require('./subscription/subscriptionRouter');

// imports the router for '/item' endpoints
const itemRouter = require('./item/itemRouter');

// imports the router for '/grouphistory' endpoints
const groupHistoryRouter = require('./groupHistory/groupHistoryRouter');

// imports the router for '/groupmember' endpoints
const groupMemberRouter = require('./groupMember/groupMemberRouter');

// imports the router for '/category' endpoints
const categoryRouter = require('./category/categoryRouter');

// imports the router for '/notification' endpoints
const notificationRouter = require('./notification/notificationRouter');

const inviteRouter = require('./invite/inviteRouter');

//* TASK *//

// imports task router for '/task' endpoint
const taskRouter = require('./task/taskRouter');

// imports the router for '/taskhistory' endpoints
const taskHistoryRouter = require('./taskHistory/taskHistoryRouter');
//WORK IN PROGRESS

// this will import the routers from the other API paths and use them for their respective endpoints

// e.g. router.use('/user', userRouter)

// This router is used by the server.js to route all paths through the '/api' endpoint

apiRouter.get('/', (req, res) => {
    res.send('This is the API root endpoint.');
});

apiRouter.use('/user', userRouter);

// apiRouter.use('/auth', authRouter);

apiRouter.use('/group', groupRouter);

apiRouter.use('/subscription', subscriptionRouter);

apiRouter.use('/comment', commentRouter);

apiRouter.use('/item', itemRouter);

apiRouter.use('/grouphistory', groupHistoryRouter);

apiRouter.use('/groupmember', groupMemberRouter);

apiRouter.use('/category', categoryRouter);

apiRouter.use('/notification', notificationRouter);

apiRouter.use('/invite', inviteRouter);

//* TASK *//
apiRouter.use('/task',taskRouter);

apiRouter.use('/taskhistory', taskHistoryRouter);

module.exports = apiRouter;