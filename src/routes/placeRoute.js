const {verifyGoogle} = require('../middleware');
const {
  getAllPlacesByGroupMembersPositionHandler,
  getPlaceByPlaceId,
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
      handler: getPlaceByPlaceId,
    },
  },
];

module.exports = placeRoute;
