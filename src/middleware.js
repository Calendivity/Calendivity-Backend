const axios = require('axios');
const Boom = require('@hapi/boom');

const verifyGoogle = async (request, h) => {
  try {
    const config = {
      headers: {Authorization: request.headers.authorization},
    };

    const userInfoRes = await axios.get(
      'https://www.googleapis.com/userinfo/v2/me',
      config,
    );

    request.authUser = userInfoRes.data;

    return h.continue;
  } catch (err) {
    if (err.response.status === 401) {
      throw Boom.unauthorized('unauthorized');
    }

    const response = h.response({
      message: err.message,
    });
    response.code(500);
    return response;
  }
};

module.exports = {verifyGoogle};
