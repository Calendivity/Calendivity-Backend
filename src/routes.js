const {authHandler} = require('./handler/authHandler');
const {userInfoHandler} = require('./handler/userHandler');
const {
  getPersonalEventsHandler,
  getGroupEventsHandler,
} = require('./handler/calendarHandler');

const routes = [
  {
    method: 'GET',
    path: '/',
    handler: (request, h) => {
      return 'Hello World!';
    },
  },
  {
    method: 'GET',
    path: '/auth',
    handler: authHandler,
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
    method: 'GET',
    path: '/groups/{groupId}/events',
    handler: getGroupEventsHandler,
  },
];

module.exports = routes;
