const {verifyGoogle} = require('../middleware');
const {
  createGroupHandler,
  getGroupHandler,
  updateGroupHandler,
  deleteGroupHandler,
  getAllGroupUsersHandler,
  inviteToGroupHandler,
  removeFromGroupHandler,
} = require('../handlers/groupHandler');

const groupRoute = [
  {
    method: 'POST',
    path: '/groups',
    options: {
      pre: [{method: verifyGoogle}],
      handler: createGroupHandler,
    },
  },
  {
    method: 'GET',
    path: '/groups/{groupId}',
    options: {
      pre: [{method: verifyGoogle}],
      handler: getGroupHandler,
    },
  },
  {
    method: 'PUT',
    path: '/groups/{groupId}',
    options: {
      pre: [{method: verifyGoogle}],
      handler: updateGroupHandler,
    },
  },
  {
    method: 'DELETE',
    path: '/groups/{groupId}',
    options: {
      pre: [{method: verifyGoogle}],
      handler: deleteGroupHandler,
    },
  },
  {
    method: 'GET',
    path: '/groups/{groupId}/users',
    options: {
      pre: [{method: verifyGoogle}],
      handler: getAllGroupUsersHandler,
    },
  },
  {
    method: 'POST',
    path: '/groups/{groupId}/users',
    options: {
      pre: [{method: verifyGoogle}],
      handler: inviteToGroupHandler,
    },
  },
  {
    method: 'DELETE',
    path: '/groups/{groupId}/users',
    options: {
      pre: [{method: verifyGoogle}],
      handler: removeFromGroupHandler,
    },
  },
];

module.exports = groupRoute;
