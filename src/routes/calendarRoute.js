const {verifyGoogle} = require('../middleware');
const {
  getAllPersonalEventsHandler,
  getAllPersonalEventActivitiesHandler,
  getAllGroupEventsHandler,
  getAllGroupEventActivitiesHandler,
} = require('../handlers/calendarHandler');

const calendarRoute = [
  {
    method: 'GET',
    path: '/users/events',
    options: {
      pre: [{method: verifyGoogle}],
      handler: getAllPersonalEventsHandler,
    },
  },
  {
    method: 'GET',
    path: '/users/eventactivities',
    options: {
      pre: [{method: verifyGoogle}],
      handler: getAllPersonalEventActivitiesHandler,
    },
  },
  {
    method: 'GET',
    path: '/groups/{groupId}/events',
    options: {
      pre: [{method: verifyGoogle}],
      handler: getAllGroupEventsHandler,
    },
  },
  {
    method: 'GET',
    path: '/groups/{groupId}/eventactivities',
    options: {
      pre: [{method: verifyGoogle}],
      handler: getAllGroupEventActivitiesHandler,
    },
  },
];

module.exports = calendarRoute;
