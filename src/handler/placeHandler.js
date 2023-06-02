/* eslint-disable require-jsdoc */
const {db} = require('../../firestore');
const axios = require('axios');

const getPlacesByGroupMembersPositionHandler = async (request, h) => {
  // Get users from membership firestore collection based on groupId
  const {groupId} = request.params;
  const groupsRef = db.collection('memberships');
  const snapshot = await groupsRef.where('groupId', '==', groupId).get();

  const users = [];
  snapshot.forEach((doc) => {
    users.push(doc.data().userId);
  });

  // Function to fetch user locations from Firestore based on user IDs
  async function getUserLocations(userIds) {
    const locations = [];
    const userRef = db.collection('users');

    for (const userId of userIds) {
      const locationSnapshot = await userRef.doc(userId).get();
      const location = locationSnapshot.data().position;
      locations.push(location);
    }

    return locations;
  }

  // Process user locations and calculate midpoint
  try {
    const userLocations = await getUserLocations(users);

    let sumLatRadians = 0;
    let sumLonRadians = 0;

    // Convert to radians and sum up the coordinates
    for (const location of userLocations) {
      const latRad = location._latitude * (Math.PI / 180);
      const lonRad = location._longitude * (Math.PI / 180);
      sumLatRadians += latRad;
      sumLonRadians += lonRad;
    }

    // Midpoint calculation
    const midLatRadians = sumLatRadians / userLocations.length;
    const midLonRadians = sumLonRadians / userLocations.length;

    // Conversion back to degrees
    const midpointLatitude = midLatRadians * (180 / Math.PI);
    const midpointLongitude = midLonRadians * (180 / Math.PI);

    //
    const {radius = 1000, keyword = 'meeting room'} = request.query;

    // Execute axios and return user events array
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${midpointLatitude}%2C${midpointLongitude}&radius=${radius}&keyword=${keyword}&key=${process.env.MAPS_API_KEY}`,
    );
    return h.response(response.data.results);
  } catch (error) {
    console.error('Error:', error);
    const response = h.response({
      message: error.message,
    });
    response.code(500);
    return response;
  }
};

module.exports = {getPlacesByGroupMembersPositionHandler};
