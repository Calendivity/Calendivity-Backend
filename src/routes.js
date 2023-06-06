const {verifyGoogle} = require('./middleware');
const {authHandler, tokenRefreshHandler} = require('./handler/authHandler');
const {
  userInfoHandler,
  getUserGroupsHandler,
} = require('./handler/userHandler');
const {
  createGroupHandler,
  inviteToGroupHandler,
  removeFromGroupHandler,
  getGroupUsersHandler,
} = require('./handler/groupHandler');
const {
  getPersonalEventsHandler,
  getGroupEventsHandler,
} = require('./handler/calendarHandler');
const {
  getPlacesByGroupMembersPositionHandler,
} = require('./handler/placeHandler');
const {
  createGroupActivityHandler,
  getAllGroupActivitiesHandler,
  getGroupActivityHandler,
  updateGroupActivityHandler,
  deleteGroupActivityHandler,
} = require('./handler/groupActivityHandler');
const {
  createUserActivityHandler,
  getUserActivityHandler,
  getAllUserActivitiesHandler,
  updateUserActivityHandler,
  deleteUserActivityHandler,
} = require('./handler/userActivityHandler');
const routes = [
  {
    method: 'GET',
    path: '/auth',
    handler: authHandler,
  },
  {
    method: 'POST',
    path: '/tokenrefresh',
    handler: tokenRefreshHandler,
  },
  {
    method: 'GET',
    path: '/userinfo',
    handler: userInfoHandler,
  },
  {
    method: 'GET',
    path: '/users/events',
    options: {
      pre: [{method: verifyGoogle}],
      handler: getPersonalEventsHandler,
    },
  },
  {
    method: 'GET',
    path: '/users/groups',
    options: {
      pre: [{method: verifyGoogle}],
      handler: getUserGroupsHandler,
    },
  },
  {
    method: 'POST',
    path: '/groups',
    options: {
      pre: [{method: verifyGoogle}],
      handler: createGroupHandler,
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
    method: 'GET',
    path: '/groups/{groupId}/users',
    options: {
      pre: [{method: verifyGoogle}],
      handler: getGroupUsersHandler,
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
  {
    method: 'GET',
    path: '/groups/{groupId}/events',
    options: {
      pre: [{method: verifyGoogle}],
      handler: getGroupEventsHandler,
    },
  },
  {
    method: 'GET',
    path: '/groups/{groupId}/places',
    options: {
      pre: [{method: verifyGoogle}],
      handler: getPlacesByGroupMembersPositionHandler,
    },
  },
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
  {
    method: 'POST',
    path: '/users/{calendarId}/activities',
    options: {
      pre: [{method: verifyGoogle}],
      handler: createUserActivityHandler,
    },
  },
  {
    method: 'GET',
    path: '/users/{calendarId}/activities/{activityId}',
    options: {
      pre: [{method: verifyGoogle}],
      handler: getUserActivityHandler,
    },
  },
  {
    method: 'GET',
    path: '/users/{calendarId}/activities',
    options: {
      pre: [{method: verifyGoogle}],
      handler: getAllUserActivitiesHandler,
    },
  },
  {
    method: 'PUT',
    path: '/users/{calendarId}/activities/{activityId}',
    options: {
      pre: [{method: verifyGoogle}],
      handler: updateUserActivityHandler,
    },
  },
  {
    method: 'DELETE',
    path: '/users/{calendarId}/activities/{activityId}',
    options: {
      pre: [{method: verifyGoogle}],
      handler: deleteUserActivityHandler,
    },
  },
];

module.exports = routes;
