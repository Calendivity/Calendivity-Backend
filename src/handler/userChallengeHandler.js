const {db} = require('../../firestore');

const createUserChallenge = async (request, h) => {
  try {
    const userId = request.authUser.email;
    const {challengeId} = request.payload;

    // check request body paylaod
    if (!challengeId) {
      const response = h.response({
        message: 'bad request',
      });
      response.code(400);
      return response;
    }

    const challengesRef = await db.collection('challenges');
    const challenge = await challengesRef.doc(challengeId).get();

    // check if user challenge exists
    if (!challenge.exists) {
      const response = h.response({
        message: `user challenge ${challengeId} does not exist`,
      });
      response.code(404);
      return response;
    }

    // add new user challenge to userChallenges collection
    const userChallengesRef = await db.collection('userChallenges');
    const userChallengeSnap = await userChallengesRef.add({
      userId,
      challengeId,
      points: 0,
    });
    userChallengesRef.doc(userChallengeSnap.id).update({
      userChallengeId: userChallengeSnap.id,
    });

    const response = h.response({
      message: 'user challenge successfully created',
      data: {
        activityId: userChallengeSnap.id,
      },
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

const getAllUserChallengeHandler = async (request, h) => {
  try {
    const userChallenges = [];
    const userChallengesRef = await db.collection('userChallenges');

    // get all user challenges
    const userChallengesSnap = await userChallengesRef.get();
    userChallengesSnap.forEach((doc) => {
      userChallenges.push(doc.data());
    });

    const response = h.response({
      message: 'oke',
      data: userChallenges,
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

module.exports = {createUserChallenge, getAllUserChallengeHandler};
