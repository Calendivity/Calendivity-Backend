const {db} = require('../../firestore');
const axios = require('axios');

const userInfoHandler = async (request, h) => {
  try {
    const config = {
      headers: {Authorization: request.headers.authorization},
    };

    // call google userinfo api
    const userInfoRes = await axios.get(
      'https://www.googleapis.com/userinfo/v2/me',
      config,
    );

    const response = h.response({
      data: userInfoRes.data,
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

const getUserGroupsHandler = async (request, h) => {
  try {
    const userId = request.authUser.email;

    // Get Groups that have User Id
    const userRef = await db.collection('memberships');
    const snapshotUser = await userRef.where('userId', '==', userId).get();

    const groupsId = [];
    snapshotUser.forEach((doc) => {
      groupsId.push(doc.data().groupId);
    });

    // Get data from database collection groups
    const getDataGroup = [];
    await Promise.all(
      groupsId.map(async (groupId) => {
        const userRes = await db.collection('groups').doc(groupId).get();
        getDataGroup.push({
          groupId: userRes.data().groupId,
          groupName: userRes.data().groupName,
          description: userRes.data().description,
        });
      }),
    );

    const response = h.response({
      data: getDataGroup,
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

module.exports = {userInfoHandler, getUserGroupsHandler};
