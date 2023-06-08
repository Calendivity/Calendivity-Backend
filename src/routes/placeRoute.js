const {verifyGoogle} = require('../middleware');
const {
  getAllPlacesByGroupMembersPositionHandler,
  getPlaceById,
} = require('../handlers/placeHandler');

const placeRoute = [
  {
    method: 'GET',
    path: '/groups/{groupId}/places',
    options: {
      pre: [{method: verifyGoogle}],
      handler: getAllPlacesByGroupMembersPositionHandler,
    },
  },
  {
    method: 'GET',
    path: '/places/{placeId}',
    options: {
      pre: [{method: verifyGoogle}],
      handler: getPlaceById,
    },
  },
];

module.exports = placeRoute;
