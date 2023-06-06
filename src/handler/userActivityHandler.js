const {Timestamp} = require('@google-cloud/firestore');
const {db} = require('../../firestore');
// const axios = require('axios');

const createUserActivityHandler = async (request, h) => {
  try {
    const {calendarId} = request.params;
    const {activityName, startTime, endTime, isFinish, finishTime} =
      request.payload;

    // check request body payload
    if (
      !activityName ||
      !startTime ||
      !endTime ||
      !finishTime ||
      isFinish === undefined
    ) {
      const response = h.response({
        message: 'bad request',
      });
      response.code(400);
      return response;
    }

    // check if user exists
    const userRes = await db.collection('users').doc(calendarId).get();
    if (!userRes.exists) {
      const response = h.response({
        message: `user ${calendarId} does not exist`,
      });
      response.code(404);
      return response;
    }
    // create a new activities with autogenerated id
    const activitiesRes = await db.collection('userActivities').add({
      userId: calendarId,
      activityName: activityName,
      startTime: Timestamp.fromDate(new Date(startTime)),
      endTime: Timestamp.fromDate(new Date(endTime)),
      finishTime: Timestamp.fromDate(new Date(finishTime)),
      isFinish: isFinish,
    });
    // update the activities id property
    db.collection('userActivities').doc(activitiesRes.id).update({
      activityId: activitiesRes.id,
    });

    const response = h.response({
      message: `activity ${activityName} successfully created`,
      data: {
        activityId: activitiesRes.id,
        activityName: activityName,
      },
    });
    response.code(201);
    return response;
  } catch (err) {
    const response = h.response({
      message: err.message,
    });
    response.code(500);
    return response;
  }
};

const getUserActivityHandler = async (request, h) => {
  try {
    const {calendarId, activityId} = request.params;

    // check if user exists
    const userRes = await db.collection('users').doc(calendarId).get();
    if (!userRes.exists) {
      const response = h.response({
        message: `user ${calendarId} does not exist`,
      });
      response.code(404);
      return response;
    }

    // Get activity id from database collection userActivities
    const userActivitiesRef = await db.collection('userActivities');
    const userActivity = await userActivitiesRef.doc(activityId).get();

    // check if activity exist
    if (!userActivity.exists) {
      const response = h.response({
        message: `activity ${activityId} does not exist`,
      });
      response.code(404);
      return response;
    }
    // const activities = [];
    // snapshotUserActivities.forEach((doc) => {
    //   activities.push(doc.data());
    // });
    const response = h.response({
      message: 'Activity is successfully required',
      data: {
        ...userActivity.data(),
        startTime: new Date(userActivity.data().startTime.seconds * 1000),
        endTime: new Date(userActivity.data().endTime.seconds * 1000),
        finishTime: new Date(userActivity.data().finishTime.seconds * 1000),
      },
    });
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

const getAllUserActivitiesHandler = async (request, h) => {
  try {
    const {calendarId} = request.params;
    const {name} = request.query;
    // check if user exists
    const userRes = await db.collection('users').doc(calendarId).get();
    if (!userRes.exists) {
      const response = h.response({
        message: `user ${calendarId} does not exist`,
      });
      response.code(404);
      return response;
    }

    const userActivities = [];
    const userActivitiesRef = await db.collection('userActivities');

    if (name) {
      const userActivitiesResByName = await userActivitiesRef
        .where('activityName', '>=', name)
        .where('activityName', '<=', name + '\uf8ff')
        .get();
      userActivitiesResByName.forEach((doc) => {
        userActivities.push({
          ...doc.data(),
          startTime: new Date(doc.data().startTime.seconds * 1000),
          endTime: new Date(doc.data().endTime.seconds * 1000),
          finishTime: new Date(doc.data().finishTime.seconds * 1000),
        });
      });

      const response = h.response({
        message: 'oke',
        data: userActivities,
      });
      response.code(200);
      return response;
    }

    const userActivitiesRes = await userActivitiesRef
      .where('userId', '==', calendarId)
      .get();
    userActivitiesRes.forEach((doc) => {
      userActivities.push({
        ...doc.data(),
        startTime: new Date(doc.data().startTime.seconds * 1000),
        endTime: new Date(doc.data().endTime.seconds * 1000),
        finishTime: new Date(doc.data().finishTime.seconds * 1000),
      });
    });

    const response = h.response({
      message: 'oke',
      data: userActivities,
    });
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
module.exports = {createUserActivityHandler, getUserActivityHandler, getAllUserActivitiesHandler};
