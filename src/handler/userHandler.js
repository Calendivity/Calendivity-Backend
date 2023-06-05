const {db} = require('../../firestore');
const axios = require('axios');
const Boom = require('@hapi/boom');

const userInfoHandler = (request, h) => {
  const config = {
    headers: {Authorization: request.headers.authorization},
  };

  // call google userinfo api
  return axios
    .get('https://www.googleapis.com/userinfo/v2/me', config)
    .then((res) => {
      const response = h.response(res.data);
      return response;
    })
    .catch((err) => {
      if (err.response.status === 401) {
        throw Boom.unauthorized('unauthorized');
      }
      throw Boom.internal(err.message);
    });
};

const groupsHaveXUser = async (request, h) => {
  const {userId} = request.params;

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
      getDataGroup.push(userRes.data());
    }),
  );

  const response = h.response({
    message: `This Users have ${getDataGroup.length} Groups:`,
    DataGroup: getDataGroup,
  });
  return response;
};

module.exports = {userInfoHandler, groupsHaveXUser};
