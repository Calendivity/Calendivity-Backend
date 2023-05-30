const {db} = require('../../firestore');
const axios = require('axios');
const Boom = require('@hapi/boom');

const getPersonalEventsHandler = (request, h) => {
  const config = {
    headers: {Authorization: request.headers.authorization},
  };

  // make string query for axios
  const dateMin = new Date().toISOString();
  let query = `dateMin=${dateMin}`;
  for (const q in request.query) {
    query += '&' + q + '=' + request.query[q];
  }
  const {calendarId} = request.params;

  // execute axios and return user events array
  return axios
    .get(
      `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events?${query}`,
      config,
    )
    .then((res) => {
      const response = h.response(res.data);
      return response;
    })
    .catch((err) => {
      throw Boom.internal(err.message);
    });
};

const getGroupEventsHandler = async (request, h) => {
  const config = {
    headers: {Authorization: request.headers.authorization},
  };

  // get users from membership firestore collection based on groupId
  const {groupId} = request.params;
  const groupsRef = await db.collection('memberships');
  const snapshot = await groupsRef.where('groupId', '==', groupId).get();

  const users = [];
  snapshot.forEach((doc) => {
    users.push(doc.data().userId);
  });

  // make string query for axios
  const dateMin = new Date().toISOString();
  let query = `dateMin=${dateMin}`;
  for (const q in request.query) {
    query += '&' + q + '=' + request.query[q];
  }

  // execute axios from users array and return the user events array from same group
  return axios
    .all(
      users.map((calendarId) =>
        axios.get(
          `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events?${query}`,
          config,
        ),
      ),
    )
    .then((responses) => {
      const userEvents = [];
      responses.forEach((response) => {
        const summary = response.data.summary;
        response.data.items.forEach((item) => {
          userEvents.push({
            user: summary,
            event: item,
          });
        });
      });
      return userEvents;
    });
};

module.exports = {getPersonalEventsHandler, getGroupEventsHandler};
