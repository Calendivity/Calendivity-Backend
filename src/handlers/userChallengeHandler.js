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

    // check if challenge exists
    if (!challenge.exists) {
      const response = h.response({
        message: 'challenge not found',
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
        userChallengeId: userChallengeSnap.id,
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
    for (const doc of userChallengesSnap.docs) {
      const challengeSnap = await db
        .collection('challenges')
        .doc(doc.data().challengeId)
        .get();
      userChallenges.push({
        userChallengeId: doc.data().userChallengeId,
        challengeId: doc.data().challengeId,
        goals: challengeSnap.data().goals,
        points: doc.data().points,
      });
    }

    const response = h.response({
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

const getUserChallengeHandler = async (request, h) => {
  try {
    const {userChallengeId} = request.params;

    // get a user challenge from userChellenges collection by userChallengeId
    const userChallengesRef = await db.collection('userChallenges');
    const userChallenge = await userChallengesRef.doc(userChallengeId).get();
    const challenge = await db
      .collection('challenges')
      .doc(userChallenge.data().challengeId)
      .get();

    // check if user challenge exists
    if (!userChallenge.exists) {
      const response = h.response({
        message: 'user challenge not found',
      });
      response.code(404);
      return response;
    }

    const response = h.response({
      data: {
        userChallengeId: userChallenge.data().userChallengeId,
        challengeId: userChallenge.data().challengeId,
        goals: challenge.data().goals,
        points: userChallenge.data().points,
      },
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

const updateUserChallengeHandler = async (request, h) => {
  try {
    const {userChallengeId} = request.params;
    const {points} = request.payload;

    // check request body paylaod
    if (!points) {
      const response = h.response({
        message: 'no content',
      });
      response.code(204);
      return response;
    }

    // get a user challenge from userChellenges collection by userChallengeId
    const userChallengesRef = await db.collection('userChallenges');
    const userChallenge = await userChallengesRef.doc(userChallengeId).get();

    // check if user challenge exists
    if (!userChallenge.exists) {
      const response = h.response({
        message: 'user challenge not found',
      });
      response.code(404);
      return response;
    }

    // check undefined properties
    const updatedUserChallenge = {};
    if (points) {
      updatedUserChallenge.points = points;
    }

    // update user challenge
    userChallengesRef.doc(userChallengeId).update(updatedUserChallenge);

    const response = h.response({
      message: 'user challenge successfully updated',
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

const deleteUserChallengeHandler = async (request, h) => {
  try {
    const {userChallengeId} = request.params;

    // get a user challenge from userChellenges collection by userChallengeId
    const userChallengesRef = await db.collection('userChallenges');
    const userChallenge = await userChallengesRef.doc(userChallengeId).get();

    // check if user challenge exists
    if (!userChallenge.exists) {
      const response = h.response({
        message: 'user challenge not found',
      });
      response.code(404);
      return response;
    }

    // delete user challenge
    userChallengesRef.doc(userChallengeId).delete();

    const response = h.response({
      message: 'user challenge successfully deleted',
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

module.exports = {
  createUserChallenge,
  getAllUserChallengeHandler,
  getUserChallengeHandler,
  updateUserChallengeHandler,
  deleteUserChallengeHandler,
};
