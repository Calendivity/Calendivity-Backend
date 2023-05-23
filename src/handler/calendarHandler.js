const axios = require('axios');

const getPersonalEventsHandler = (request, h) => {
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

  const {calendarId} = request.params;
  return axios
    .get(
      `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events`,
      config,
    )
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

module.exports = {getPersonalEventsHandler};
