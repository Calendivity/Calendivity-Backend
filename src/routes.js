const {authHandler} = require('./handler/authHandler');
const {userInfoHandler} = require('./handler/userHandler');
const {getPersonalEventsHandler} = require('./handler/calendarHandler');

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
    path: '/{calendarId}/events',
    handler: getPersonalEventsHandler,
  },
];

module.exports = routes;
