const {db} = require('../../firestore');
const axios = require('axios');
const Boom = require('@hapi/boom');
const {GeoPoint} = require('@google-cloud/firestore');

const userLoginHandler = async (request, h) => {
  const config = {
    headers: {Authorization: request.headers.authorization},
  };

  // call google userinfo api
  return axios
    .get('https://www.googleapis.com/userinfo/v2/me', config)
    .then(async (res) => {
      const {email} = request.payload;

      // get user data from firestore
      const userRef = await db.collection('users');
      const user = await userRef.doc(email).get();

      // if user data doesn't exists in firestore, it will create new record for new user
      if (!user.exists) {
        const userInfo = res.data;
        await userRef.doc(email).set({
          calendarId: userInfo.email,
          email: userInfo.email,
          name: userInfo.name,
          position: new GeoPoint(-6.2, 106.816666),
        });
      }
      const response = h.response({
        message: 'login success',
      });
      response.code(200);
      return response;
    })
    .catch((err) => {
      if (err.response.status === 401) {
        throw Boom.unauthorized('unauthorized');
      }
      throw Boom.internal(err.message);
    });
};

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

module.exports = {userInfoHandler, userLoginHandler};
