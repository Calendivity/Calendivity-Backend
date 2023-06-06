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

const getAllChallengesHandler = async (request, h) => {
  try {
    const {name} = request.query;

    const challenges = [];
    const challengesRef = await db.collection('challenges');

    // get all challenge filtered by name
    if (name) {
      const challengesByName = await challengesRef
        .where('challengeName', '>=', name)
        .where('challengeName', '<=', name + '\uf8ff')
        .get();
      challengesByName.forEach((doc) => {
        challenges.push({
          ...doc.data(),
          startTime: new Date(doc.data().startTime.seconds * 1000),
          endTime: new Date(doc.data().endTime.seconds * 1000),
        });
      });

      const response = h.response({
        message: 'oke',
        data: challenges,
      });
      response.code(200);
      return response;
    }

    // get all challenge
    const challengesSnap = await challengesRef.get();
    challengesSnap.forEach((doc) => {
      challenges.push({
        ...doc.data(),
        startTime: new Date(doc.data().startTime.seconds * 1000),
        endTime: new Date(doc.data().endTime.seconds * 1000),
      });
    });

    const response = h.response({
      message: 'oke',
      data: challenges,
    });
    response.code(200);
    return response;
  } catch (err) {
    const response = h.response({
      message: err.message,
    });
    response.code(500);
    return response;
  }
};

module.exports = {createChallengeHandler, getAllChallengesHandler};
