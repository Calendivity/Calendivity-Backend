const {db} = require('../../firestore');
const {Timestamp} = require('@google-cloud/firestore');

const createGroupActivityHandler = async (request, h) => {
  try {
    const {groupId} = request.params;
    const {activityName, description, startTime, endTime, finishTime} =
      request.payload;

    // check request body paylaod
    if (!activityName || !description || !startTime || !endTime) {
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
      response.code(404);
      return response;
    }

    const groupActivitiesRef = await db.collection('groupActivities');
    const groupActivityRes = await groupActivitiesRef.add({
      groupId: groupId,
      activityName: activityName,
      description: description,
      startTime: Timestamp.fromDate(new Date(startTime)),
      endTime: Timestamp.fromDate(new Date(endTime)),
      finishTime:
        finishTime !== undefined
          ? Timestamp.fromDate(new Date(finishTime))
          : null,
    });
    groupActivitiesRef.doc(groupActivityRes.id).update({
      activityId: groupActivityRes.id,
    });

    const response = h.response({
      message: 'group activity successfully created',
      data: {
        activityId: groupActivityRes.id,
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

const getAllGroupActivitiesHandler = async (request, h) => {
  try {
    const {groupId} = request.params;
    const {name} = request.query;

    // check if group exists
    const groupRes = await db.collection('groups').doc(groupId).get();
    if (!groupRes.exists) {
      const response = h.response({
        message: `group ${groupId} does not exist`,
      });
      response.code(404);
      return response;
    }

    const groupActivities = [];
    const groupActivitiesRef = await db.collection('groupActivities');

    if (name) {
      const groupActivitiesResByName = await groupActivitiesRef
        .where('activityName', '>=', name)
        .where('activityName', '<=', name + '\uf8ff')
        .get();
      groupActivitiesResByName.forEach((doc) => {
        groupActivities.push({
          activityId: doc.data().activityId,
          activityName: doc.data().activityName,
          description: doc.data().description,
          startTime: new Date(doc.data().startTime.seconds * 1000),
          endTime: new Date(doc.data().endTime.seconds * 1000),
          finishTime:
            doc.data().finishTime !== null
              ? new Date(doc.data().finishTime.seconds * 1000)
              : null,
        });
      });

      const response = h.response({
        message: 'oke',
        data: groupActivities,
      });
      response.code(200);
      return response;
    }

    const groupActivitiesRes = await groupActivitiesRef
      .where('groupId', '==', groupId)
      .get();
    groupActivitiesRes.forEach((doc) => {
      groupActivities.push({
        activityId: doc.data().activityId,
        activityName: doc.data().activityName,
        description: doc.data().description,
        startTime: new Date(doc.data().startTime.seconds * 1000),
        endTime: new Date(doc.data().endTime.seconds * 1000),
        finishTime:
          doc.data().finishTime !== null
            ? new Date(doc.data().finishTime.seconds * 1000)
            : null,
      });
    });

    const response = h.response({
      data: groupActivities,
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

const getGroupActivityHandler = async (request, h) => {
  try {
    const {groupId, activityId} = request.params;

    // check if group exists
    const groupRes = await db.collection('groups').doc(groupId).get();
    if (!groupRes.exists) {
      const response = h.response({
        message: `group ${groupId} does not exist`,
      });
      response.code(404);
      return response;
    }

    const groupActivitiesRef = await db.collection('groupActivities');
    const groupActivity = await groupActivitiesRef.doc(activityId).get();

    // check if activity exists
    if (!groupActivity.exists) {
      const response = h.response({
        message: `activity ${activityId} does not exist`,
      });
      response.code(404);
      return response;
    }

    const response = h.response({
      data: {
        activityId: groupActivity.data().activityId,
        activityName: groupActivity.data().activityName,
        description: groupActivity.data().description,
        startTime: new Date(groupActivity.data().startTime.seconds * 1000),
        endTime: new Date(groupActivity.data().endTime.seconds * 1000),
        finishTime:
          groupActivity.data().finishTime !== null
            ? new Date(groupActivity.data().finishTime.seconds * 1000)
            : null,
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

const updateGroupActivityHandler = async (request, h) => {
  try {
    const {groupId, activityId} = request.params;
    const {
      activityName,
      description,
      startTime,
      endTime,
      finishTime,
      isFinish,
    } = request.payload;

    // check request body paylaod
    if (
      !activityName &&
      !description &&
      !startTime &&
      !endTime &&
      !finishTime &&
      isFinish === undefined
    ) {
      const response = h.response({
        message: 'no content',
      });
      response.code(204);
      return response;
    }

    // check if group exists
    const groupRes = await db.collection('groups').doc(groupId).get();
    if (!groupRes.exists) {
      const response = h.response({
        message: `group ${groupId} does not exist`,
      });
      response.code(404);
      return response;
    }

    const groupActivitiesRef = await db.collection('groupActivities');
    const groupActivity = await groupActivitiesRef.doc(activityId).get();

    // check if activity exists
    if (!groupActivity.exists) {
      const response = h.response({
        message: `activity ${activityId} does not exist`,
      });
      response.code(404);
      return response;
    }

    // check the undefined properties
    const updatedActivity = {};
    if (activityName) {
      updatedActivity.activityName = activityName;
    }
    if (description) {
      updatedActivity.description = description;
    }
    if (startTime) {
      updatedActivity.startTime = Timestamp.fromDate(new Date(startTime));
    }
    if (endTime) {
      updatedActivity.endTime = Timestamp.fromDate(new Date(endTime));
    }
    if (finishTime) {
      updatedActivity.finishTime = Timestamp.fromDate(new Date(finishTime));
    }
    if (isFinish !== undefined) {
      updatedActivity.isFinish = isFinish;
    }

    groupActivitiesRef.doc(activityId).update(updatedActivity);

    const response = h.response({
      message: 'group activity successfully updated',
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

const deleteGroupActivityHandler = async (request, h) => {
  try {
    const {groupId, activityId} = request.params;

    // check if group exists
    const groupRes = await db.collection('groups').doc(groupId).get();
    if (!groupRes.exists) {
      const response = h.response({
        message: `group ${groupId} does not exist`,
      });
      response.code(404);
      return response;
    }

    const groupActivitiesRef = await db.collection('groupActivities');
    const groupActivity = await groupActivitiesRef.doc(activityId).get();

    // check if activity exists
    if (!groupActivity.exists) {
      const response = h.response({
        message: `activity ${activityId} does not exist`,
      });
      response.code(404);
      return response;
    }

    groupActivitiesRef.doc(activityId).delete();

    const response = h.response({
      message: 'group activity successfully deleted',
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

module.exports = {
  createGroupActivityHandler,
  getAllGroupActivitiesHandler,
  getGroupActivityHandler,
  updateGroupActivityHandler,
  deleteGroupActivityHandler,
};
