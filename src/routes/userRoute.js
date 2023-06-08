const {verifyGoogle} = require('../middleware');
const {
  userInfoHandler,
  getUserGroupsHandler,
} = require('../handlers/userHandler');

const userRoute = [
  {
    method: 'GET',
    path: '/userinfo',
    handler: userInfoHandler,
  },
  {
    method: 'GET',
    path: '/users/groups',
    options: {
      pre: [{method: verifyGoogle}],
      handler: getUserGroupsHandler,
    },
  },
];

module.exports = userRoute;
