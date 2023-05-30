const axios = require('axios');
const Boom = require('@hapi/boom');

const verifyGoogle = async (request, h) => {
  const config = {
    headers: {Authorization: request.headers.authorization},
  };

  return axios
    .get('https://www.googleapis.com/userinfo/v2/me', config)
    .then((res) => {
      return h.continue;
    })
    .catch((err) => {
      if (err.response.status === 401) {
        throw Boom.unauthorized('unauthorized');
      }
      throw Boom.internal(err.message);
    });
};

module.exports = {verifyGoogle};
