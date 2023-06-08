const {verifyGoogle} = require('../middleware');
const {
  createGroupActivityHandler,
  getAllGroupActivitiesHandler,
  getGroupActivityHandler,
  updateGroupActivityHandler,
  deleteGroupActivityHandler,
} = require('../handlers/groupActivityHandler');

const groupActivityRoute = [
  {
    method: 'POST',
    path: '/groups/{groupId}/activities',
    options: {
      pre: [{method: verifyGoogle}],
      handler: createGroupActivityHandler,
    },
  },
  {
    method: 'GET',
    path: '/groups/{groupId}/activities',
    options: {
      pre: [{method: verifyGoogle}],
      handler: getAllGroupActivitiesHandler,
    },
  },
  {
    method: 'GET',
    path: '/groups/{groupId}/activities/{activityId}',
    options: {
      pre: [{method: verifyGoogle}],
      handler: getGroupActivityHandler,
    },
  },
  {
    method: 'PUT',
    path: '/groups/{groupId}/activities/{activityId}',
    options: {
      pre: [{method: verifyGoogle}],
      handler: updateGroupActivityHandler,
    },
  },
  {
    method: 'DELETE',
    path: '/groups/{groupId}/activities/{activityId}',
    options: {
      pre: [{method: verifyGoogle}],
      handler: deleteGroupActivityHandler,
    },
  },
];

module.exports = groupActivityRoute;
