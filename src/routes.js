const {authHandler} = require('./handler/authHandler');
const {userInfoHandler} = require('./handler/userHandler');

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
];

module.exports = routes;
