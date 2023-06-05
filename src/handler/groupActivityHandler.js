const {db} = require('../../firestore');
const {Timestamp} = require('@google-cloud/firestore');

const createGroupActivityHandler = async (request, h) => {
  try {
    const {groupId} = request.params;
    const {name, startTime, endTime, finishTime, isFinish} = request.payload;

    // check request body paylaod
    if (!name || !startTime || !endTime || !finishTime || !isFinish) {
      const response = h.response({
        message: 'bad request',
      });
      response.code(400);
      return response;
    }

    // check if group exists
    const groupRes = await db.collection('groups').doc(groupId).get();
    if (!groupRes.exists) {
      const response = h.response({
        message: `group ${groupId} does not exist`,
      });
      response.code(400);
      return response;
    }

    const groupActivitiesRef = await db.collection('groupActivities');
    const groupActivityRes = await groupActivitiesRef.add({
      groupId,
      name,
      startTime: Timestamp.fromDate(new Date(startTime)),
      endTime: Timestamp.fromDate(new Date(endTime)),
      finishTime: Timestamp.fromDate(new Date(finishTime)),
      isFinish,
    });
    groupActivitiesRef.doc(groupActivityRes.id).update({
      activityId: groupActivityRes.id,
    });

    const response = h.response({
      message: 'group activity successfully created',
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

module.exports = {createGroupActivityHandler};
