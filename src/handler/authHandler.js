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
  if (code === undefined) {
    const response = h.response({
      message: 'missing query parameter: code',
    });
    response.code(400);
    return response;
  }

  try {
    const oauth2Client = await authorize();
    const {tokens} = await oauth2Client.getToken(code);
    const response = h.response({
      tokens,
    });
    return response;
  } catch (err) {
    if (err.response.status !== 500) {
      const response = h.response({
        message: err.response.statusText,
        ...err.response.data,
      });
      response.code(err.response.status);
      return response;
    }

    const response = h.response({
      message: err.message,
    });
    response.code(500);
    return response;
  }
};

module.exports = {authHandler};
