const {db} = require('../../firestore');
// const axios = require('axios');

const createUserActivityHandler = async (request, h) => {
  const {userId, activityName, startTime, endTime, isFinish, finishTime} = request.payload;

  // create a new activities with autogenerated id
  const activitiesRes = await db.collection('userActivities').add({
    userId: userId,
    activityName: activityName,
    startTime: startTime,
    endTime: endTime,
    isFinish: isFinish,
    finishTime: finishTime,
  });
  // update the activities id property
  db.collection('userActivities').doc(activitiesRes.id).update({
    activityId: activitiesRes.id,
  });

  const response = h.response({
    message: `activity ${activityName} successfully created`,
    activityId: activitiesRes.id,
    activityName: activityName,
  });
  response.code(201);
  return response;
};

const getUserActivityHandler = async (request, h) => {
  const {activityId} = request.params;

  // Get activity id from database collection userActivities
  const userActivitiesRef = await db.collection('userActivities');
  const snapshotUserActivities = await userActivitiesRef.where('activityId', '==', activityId).get();

  const activities = [];
  snapshotUserActivities.forEach((doc) => {
    activities.push(doc.data());
  });
  const response = h.response({
    message: 'Activity is successfully required',
    data: activities,
  });
  return response;
};

module.exports = {createUserActivityHandler, getUserActivityHandler};
