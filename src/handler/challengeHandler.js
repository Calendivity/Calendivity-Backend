const {db} = require('../../firestore');
const {Timestamp} = require('@google-cloud/firestore');

const createChallengeHandler = async (request, h) => {
  try {
    const {challengeName, description, goals, startTime, endTime} =
      request.payload;

    // check request body paylaod
    if (!challengeName || !description || !goals || !startTime || !endTime) {
      const response = h.response({
        message: 'bad request',
      });
      response.code(400);
      return response;
    }

    const challengesRef = await db.collection('challenges');
    const challengeSnap = await challengesRef.add({
      challengeName,
      description,
      goals,
      points: 0,
      startTime: Timestamp.fromDate(new Date(startTime)),
      endTime: Timestamp.fromDate(new Date(endTime)),
    });
    challengesRef.doc(challengeSnap.id).update({challengeId: challengeSnap.id});

    const response = h.response({
      message: 'oke',
      data: {challengeId: challengeSnap.id},
    });
    response.code(201);
    return response;
  } catch (err) {
    const response = h.response({
      message: err.message,
    });
    response.code(500);
    return response;
  }
};

module.exports = {createChallengeHandler};
