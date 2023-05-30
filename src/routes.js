const {verifyGoogle} = require('./middleware');
const {authHandler} = require('./handler/authHandler');
const {userLoginHandler, userInfoHandler} = require('./handler/userHandler');
const {createGroupHandler} = require('./handler/groupHandler');
const {
  getPersonalEventsHandler,
  getGroupEventsHandler,
} = require('./handler/calendarHandler');

const routes = [
  {
    method: 'GET',
    path: '/auth',
    handler: authHandler,
  },
  {
    method: 'POST',
    path: '/login',
    handler: userLoginHandler,
  },
  {
    method: 'GET',
    path: '/userinfo',
    handler: userInfoHandler,
  },
  {
    method: 'GET',
    path: '/users/{calendarId}/events',
    handler: getPersonalEventsHandler,
  },
  {
    method: 'POST',
    path: '/groups/create',
    options: {
      pre: [{method: verifyGoogle, assign: 'verifyGoogle'}],
      handler: createGroupHandler,
    },
  },
  {
    method: 'GET',
    path: '/groups/{groupId}/events',
    handler: getGroupEventsHandler,
  },
];

module.exports = routes;
