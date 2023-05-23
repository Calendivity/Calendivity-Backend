const {authHandler} = require('./handler/authHandler');

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
];

module.exports = routes;
