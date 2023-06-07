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
  updateGroupHandler,
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
  createChallengeHandler,
  getAllChallengesHandler,
  getChallengeHandler,
  updateChallengeHandler,
  deleteChallengeHandler,
} = require('./handler/challengeHandler');
const {
  createUserActivityHandler,
  getUserActivityHandler,
  getAllUserActivitiesHandler,
  updateUserActivityHandler,
  deleteUserActivityHandler,
} = require('./handler/userActivityHandler');
const {
  createUserChallenge,
  getAllUserChallengeHandler,
  getUserChallengeHandler,
  updateUserChallengeHandler,
  deleteUserChallengeHandler,
} = require('./handler/userChallengeHandler');

const routes = [
  // auth
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
  // user
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
  // group
  {
    method: 'POST',
    path: '/groups',
    options: {
      pre: [{method: verifyGoogle}],
      handler: createGroupHandler,
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
  // group activity
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
  // challenge
  {
    method: 'POST',
    path: '/challenges',
    options: {
      pre: [{method: verifyGoogle}],
      handler: createChallengeHandler,
    },
  },
  {
    method: 'GET',
    path: '/challenges',
    options: {
      pre: [{method: verifyGoogle}],
      handler: getAllChallengesHandler,
    },
  },
  {
    method: 'GET',
    path: '/challenges/{challengeId}',
    options: {
      pre: [{method: verifyGoogle}],
      handler: getChallengeHandler,
    },
  },
  {
    method: 'PUT',
    path: '/challenges/{challengeId}',
    options: {
      pre: [{method: verifyGoogle}],
      handler: updateChallengeHandler,
    },
  },
  {
    method: 'DELETE',
    path: '/challenges/{challengeId}',
    options: {
      pre: [{method: verifyGoogle}],
      handler: deleteChallengeHandler,
    },
  },
  // user activity
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
  // user challenge
  {
    method: 'POST',
    path: '/users/challenges',
    options: {
      pre: [{method: verifyGoogle}],
      handler: createUserChallenge,
    },
  },
  {
    method: 'GET',
    path: '/users/challenges',
    options: {
      pre: [{method: verifyGoogle}],
      handler: getAllUserChallengeHandler,
    },
  },
  {
    method: 'GET',
    path: '/users/challenges/{userChallengeId}',
    options: {
      pre: [{method: verifyGoogle}],
      handler: getUserChallengeHandler,
    },
  },
  {
    method: 'PUT',
    path: '/users/challenges/{userChallengeId}',
    options: {
      pre: [{method: verifyGoogle}],
      handler: updateUserChallengeHandler,
    },
  },
  {
    method: 'DELETE',
    path: '/users/challenges/{userChallengeId}',
    options: {
      pre: [{method: verifyGoogle}],
      handler: deleteUserChallengeHandler,
    },
  },
];

module.exports = routes;
