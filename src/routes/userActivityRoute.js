const {verifyGoogle} = require('../middleware');
const {
  createUserActivityHandler,
  getAllUserActivitiesHandler,
  getUserActivityHandler,
  updateUserActivityHandler,
  deleteUserActivityHandler,
} = require('../handlers/userActivityHandler');

const userActivityRoute = [
  {
    method: 'POST',
    path: '/users/activities',
    options: {
      pre: [{method: verifyGoogle}],
      handler: createUserActivityHandler,
    },
  },
  {
    method: 'GET',
    path: '/users/activities/{activityId}',
    options: {
      pre: [{method: verifyGoogle}],
      handler: getUserActivityHandler,
    },
  },
  {
    method: 'GET',
    path: '/users/activities',
    options: {
      pre: [{method: verifyGoogle}],
      handler: getAllUserActivitiesHandler,
    },
  },
  {
    method: 'PUT',
    path: '/users/activities/{activityId}',
    options: {
      pre: [{method: verifyGoogle}],
      handler: updateUserActivityHandler,
    },
  },
  {
    method: 'DELETE',
    path: '/users/activities/{activityId}',
    options: {
      pre: [{method: verifyGoogle}],
      handler: deleteUserActivityHandler,
    },
  },
];

module.exports = userActivityRoute;
