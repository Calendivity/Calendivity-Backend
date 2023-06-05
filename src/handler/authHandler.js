const {db} = require('../../firestore');
const axios = require('axios');
const Boom = require('@hapi/boom');
const {GeoPoint} = require('@google-cloud/firestore');
const {google} = require('googleapis');

const authorize = async () => {
  const oauth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URI,
  );
  return oauth2Client;
};

const authHandler = async (request, h) => {
  const {code} = request.query;
  if (!code) {
    const response = h.response({
      message: 'missing query parameter: code',
    });
    response.code(400);
    return response;
  }

  try {
    const oauth2Client = await authorize();
    const {tokens} = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    const {data: userInfo} = await axios.get(
      'https://www.googleapis.com/userinfo/v2/me',
      {headers: {Authorization: 'Bearer ' + tokens.access_token}},
    );
    const userRef = await db.collection('users');
    const user = await userRef.doc(userInfo.email).get();

    // if user data doesn't exists in firestore, it will create new record for new user
    if (!user.exists) {
      await userRef.doc(userInfo.email).set({
        calendarId: userInfo.email,
        email: userInfo.email,
        name: userInfo.name,
        position: new GeoPoint(-6.2, 106.816666),
      });
    }
    const userRes = userRef.doc(userInfo.email);
    if (tokens.refresh_token) {
      userRes.update({refreshToken: tokens.refresh_token});
    } else {
      tokens.refresh_token = user.data().refreshToken;
    }

    const response = h.response({
      tokens,
    });
    return response;
  } catch (err) {
    const response = h.response({
      message: err.message,
    });
    response.code(500);
    return response;
  }
};

const tokenRefreshHandler = async (request, h) => {
  if (!request.payload) {
    throw Boom.badRequest('bad request');
  }
  const {accessToken, refreshToken} = request.payload;

  try {
    await axios.get(
      `https://oauth2.googleapis.com/tokeninfo?access_token=${accessToken}`,
    );
    return {access_token: accessToken};
  } catch (err) {
    if (err.response.status === 400) {
      try {
        const oauth2Client = await authorize();
        const {tokens} = await oauth2Client.refreshToken(refreshToken);
        return {access_token: tokens.access_token};
      } catch (err) {
        const response = h.response({
          message: err.response.data.error_description,
        });
        response.code(err.response.status);
        return response;
      }
    }
    const response = h.response({
      message: err.response.data,
    });
    response.code(500);
    return response;
  }
};

module.exports = {authHandler, tokenRefreshHandler};
