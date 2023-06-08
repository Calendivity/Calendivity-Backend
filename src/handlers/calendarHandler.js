const {db} = require('../../firestore');
const axios = require('axios');
const Boom = require('@hapi/boom');

const getPersonalEventsHandler = (request, h) => {
  const config = {
    headers: {Authorization: request.headers.authorization},
  };

  // make string query for axios
  const dateMin = new Date().toISOString();
  let query = `timeMin=${dateMin}&orderBy=startTime&singleEvents=true`;
  for (const q in request.query) {
    query += '&' + q + '=' + request.query[q];
  }
  const calendarId = request.authUser.email;

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

const getPersonalEventActivitiesHandler = async (request, h) => {
  try {
    const config = {
      headers: {Authorization: request.headers.authorization},
    };

    // make string query for axios
    const dateMin = new Date().toISOString();
    let query = `timeMin=${dateMin}&orderBy=startTime&singleEvents=true`;
    for (const q in request.query) {
      query += '&' + q + '=' + request.query[q];
    }
    const userId = request.authUser.email;

    // get user calendar events
    const userEvents = [];
    const eventResponses = await axios.get(
      `https://www.googleapis.com/calendar/v3/calendars/${userId}/events?${query}`,
      config,
    );
    const userEventsRes = eventResponses.data.items;
    for (const event of userEventsRes) {
      userEvents.push({
        type: 'calendar_event',
        id: event.id,
        summary: event.summary,
        description: event.description,
        startTime: new Date(event.start.dateTime),
        endTime: new Date(event.end.dateTime),
      });
    }

    // get user activities
    const userActivities = [];
    const userActivitiesRef = await db.collection('userActivities');
    const userActivitiesRes = await userActivitiesRef
      .where('userId', '==', userId)
      .get();
    userActivitiesRes.forEach((doc) => {
      userActivities.push({
        type: 'user_activity',
        id: doc.data().activityId,
        summary: doc.data().activityName,
        description: '',
        startTime: new Date(doc.data().startTime.seconds * 1000),
        endTime: new Date(doc.data().endTime.seconds * 1000),
      });
    });

    // concat user events and user activities
    let userEventActivities = [];
    userEventActivities = userEventActivities.concat(userEvents);
    userEventActivities = userEventActivities.concat(userActivities);

    // sort user event activities by startTime
    userEventActivities.sort(
      (a, b) => new Date(a.startTime) - new Date(b.startTime),
    );

    const response = h.response(userEventActivities);
    response.code(200);
    return response;
  } catch (err) {
    const response = h.response({
      message: err.message,
    });
    response.code(500);
    return response;
  }
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
  let query = `timeMin=${dateMin}&orderBy=startTime&singleEvents=true`;
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
            ...item,
          });
        });
      });
      return userEvents;
    });
};

const getGroupEventActivitiesHandler = async (request, h) => {
  try {
    const config = {
      headers: {Authorization: request.headers.authorization},
    };

    // get users from membership firestore collection based on groupId
    const {groupId} = request.params;

    const users = [];
    const groupsRef = await db.collection('memberships');
    const groupSnap = await groupsRef.where('groupId', '==', groupId).get();
    groupSnap.forEach((doc) => {
      users.push(doc.data().userId);
    });

    // make string query for axios
    const dateMin = new Date().toISOString();
    let query = `timeMin=${dateMin}&orderBy=startTime&singleEvents=true`;
    for (const q in request.query) {
      query += '&' + q + '=' + request.query[q];
    }

    const groupEvents = [];
    for (const userId of users) {
      const eventResponses = await axios.get(
        `https://www.googleapis.com/calendar/v3/calendars/${userId}/events?${query}`,
        config,
      );
      const userEventsRes = eventResponses.data.items;
      for (const event of userEventsRes) {
        groupEvents.push({
          type: 'calendar_event',
          user: userId,
          id: event.id,
          summary: event.summary,
          description: event.description,
          startTime: new Date(event.start.dateTime),
          endTime: new Date(event.end.dateTime),
        });
      }
    }

    const groupActivities = [];
    for (const userId of users) {
      const userActivitiesRef = await db.collection('userActivities');
      const userActivitiesRes = await userActivitiesRef
        .where('userId', '==', userId)
        .get();
      userActivitiesRes.forEach((doc) => {
        groupActivities.push({
          type: 'user_activity',
          user: userId,
          id: doc.data().activityId,
          summary: doc.data().activityName,
          description: doc.data().description || '',
          startTime: new Date(doc.data().startTime.seconds * 1000),
          endTime: new Date(doc.data().endTime.seconds * 1000),
        });
      });
    }

    // concat user events and user activities
    let groupEventActivities = [];
    groupEventActivities = groupEventActivities.concat(groupEvents);
    groupEventActivities = groupEventActivities.concat(groupActivities);

    // sort user event activities by startTime
    groupEventActivities.sort(
      (a, b) => new Date(a.startTime) - new Date(b.startTime),
    );

    const response = h.response(groupEventActivities);
    response.code(200);
    return response;
  } catch (err) {
    const response = h.response({
      message: err.message,
    });
    response.code(500);
    return response;
  }
};

module.exports = {
  getPersonalEventsHandler,
  getPersonalEventActivitiesHandler,
  getGroupEventsHandler,
  getGroupEventActivitiesHandler,
};
