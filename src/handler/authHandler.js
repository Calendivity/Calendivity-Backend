const path = require('path');
const {authenticate} = require('@google-cloud/local-auth');

const SCOPES = ['https://www.googleapis.com/auth/calendar'];
const CREDENTIALS_PATH = path.join(process.cwd(), 'credentials.json');

const authorize = async () => {
  const client = await authenticate({
    scopes: SCOPES,
    keyfilePath: CREDENTIALS_PATH,
  });
  return client;
};

const authHandler = async (request, h) => {
  const auth = await authorize();
  return {
    access_token: auth.credentials.access_token,
  };
};

module.exports = {authHandler};
