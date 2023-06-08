const {verifyGoogle} = require('../middleware');
const {
  getPersonalEventsHandler,
  getPersonalEventActivitiesHandler,
  getGroupEventsHandler,
  getGroupEventActivitiesHandler,
} = require('../handlers/calendarHandler');

const calendarRoute = [
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
    path: '/users/eventactivities',
    options: {
      pre: [{method: verifyGoogle}],
      handler: getPersonalEventActivitiesHandler,
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
    path: '/groups/{groupId}/eventactivities',
    options: {
      pre: [{method: verifyGoogle}],
      handler: getGroupEventActivitiesHandler,
    },
  },
];

module.exports = calendarRoute;
