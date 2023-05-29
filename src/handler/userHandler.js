const {db} = require('../../firestore');
const axios = require('axios');
const {GeoPoint} = require('@google-cloud/firestore');

const userLoginHandler = async (request, h) => {
  // get authorization header
  const {headers} = request;
  if (!headers.authorization) {
    const response = h.response({
      message: 'unauthorized access',
    });
    response.code(401);
    return response;
  }
  const config = {
    headers: {Authorization: headers.authorization},
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
      const response = h.response({
        message: err.message,
      });
      response.code(500);
      return response;
    });
};

const userInfoHandler = (request, h) => {
  // get authorization header
  const {headers} = request;
  if (!headers.authorization) {
    const response = h.response({
      message: 'unauthorized access',
    });
    response.code(401);
    return response;
  }
  const config = {
    headers: {Authorization: headers.authorization},
  };

  // call google userinfo api
  return axios
    .get('https://www.googleapis.com/userinfo/v2/me', config)
    .then((res) => {
      const response = h.response(res.data);
      return response;
    })
    .catch((err) => {
      const response = h.response({
        message: err.message,
      });
      response.code(500);
      return response;
    });
};

module.exports = {userInfoHandler, userLoginHandler};
