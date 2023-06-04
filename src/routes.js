const {verifyGoogle} = require('./middleware');
const {authHandler} = require('./handler/authHandler');
const {userLoginHandler, userInfoHandler, groupsHaveXUser} = require('./handler/userHandler');
const {
  createGroupHandler,
  inviteToGroupHandler,
  removeFromGroup,
  listNameInGroup,
} = require('./handler/groupHandler');
const {
  getPersonalEventsHandler,
  getGroupEventsHandler,
} = require('./handler/calendarHandler');
const {getPlacesByGroupMembersPositionHandler} = require('./handler/placeHandler');

const routes = [
  {
    method: 'GET',
    path: '/auth',
    handler: authHandler,
  },
  {
    method: 'POST',
    path: '/login',
    handler: userLoginHandler,
  },
  {
    method: 'GET',
    path: '/userinfo',
    handler: userInfoHandler,
  },
  {
    method: 'GET',
    path: '/users/{calendarId}/events',
    options: {
      pre: [{method: verifyGoogle}],
      handler: getPersonalEventsHandler,
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
    method: 'DELETE',
    path: '/groups/{groupId}/users',
    options: {
      pre: [{method: verifyGoogle}],
      handler: removeFromGroup,
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
    method: 'GET',
    path: '/groups/{groupId}/users',
    options: {
      pre: [{method: verifyGoogle}],
      handler: listNameInGroup,
    },
  },
  {
    method: 'GET',
    path: '/users/{userId}/groups',
    options: {
      pre: [{method: verifyGoogle}],
      handler: groupsHaveXUser,
    },
  },
];

module.exports = routes;
