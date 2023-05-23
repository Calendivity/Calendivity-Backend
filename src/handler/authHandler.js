const path = require('path');
const {authenticate} = require('@google-cloud/local-auth');

const SCOPES = [
  'openid',
  'https://www.googleapis.com/auth/userinfo.email',
  'https://www.googleapis.com/auth/userinfo.profile',
  'https://www.googleapis.com/auth/calendar',
];
const CREDENTIALS_PATH = path.join(process.cwd(), 'credentials.json');
const authorize = async () => {
  const client = await authenticate({
    scopes: SCOPES,
    keyfilePath: CREDENTIALS_PATH,
  });
  return client;
};

const authHandler = async (request, h) => {
  try {
    const auth = await authorize();
    const response = h.response({
      access_token: auth.credentials.access_token,
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

module.exports = {authHandler};
