const {Timestamp} = require('@google-cloud/firestore');
const {db} = require('../../firestore');
// const axios = require('axios');

const createUserActivityHandler = async (request, h) => {
  try {
    const {
      activityName,
      description,
      startTime,
      endTime,
      finishTime,
      location,
    } = request.payload;
    const userId = request.authUser.email;

    // check request body payload
    if (!activityName || !startTime || !endTime) {
      const response = h.response({
        message: 'bad request',
      });
      response.code(400);
      return response;
    }

    // create a new activities with autogenerated id
    const activitiesRes = await db.collection('userActivities').add({
      userId: userId,
      activityName: activityName,
      description: description || '',
      startTime: Timestamp.fromDate(new Date(startTime)),
      endTime: Timestamp.fromDate(new Date(endTime)),
      finishTime:
        finishTime !== undefined
          ? Timestamp.fromDate(new Date(finishTime))
          : null,
      location: location || '',
    });
    // update the activities id property
    db.collection('userActivities').doc(activitiesRes.id).update({
      activityId: activitiesRes.id,
    });

    const response = h.response({
      message: 'activity successfully created',
      data: {
        activityId: activitiesRes.id,
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

const getAllUserActivitiesHandler = async (request, h) => {
  try {
    const {name} = request.query;
    const userId = request.authUser.email;

    const userActivities = [];
    const userActivitiesRef = await db.collection('userActivities');

    if (name) {
      const userActivitiesResByName = await userActivitiesRef
        .where('activityName', '>=', name)
        .where('activityName', '<=', name + '\uf8ff')
        .get();
      userActivitiesResByName.forEach((doc) => {
        userActivities.push({
          activityId: doc.data().activityId,
          activityName: doc.data().activityName,
          description: doc.data().description,
          startTime: new Date(doc.data().startTime.seconds * 1000),
          endTime: new Date(doc.data().endTime.seconds * 1000),
          finishTime:
            doc.data().finishTime !== null
              ? new Date(doc.data().finishTime.seconds * 1000)
              : null,
          location: doc.data().location,
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
      .where('userId', '==', userId)
      .get();
    userActivitiesRes.forEach((doc) => {
      userActivities.push({
        activityId: doc.data().activityId,
        activityName: doc.data().activityName,
        description: doc.data().description,
        startTime: new Date(doc.data().startTime.seconds * 1000),
        endTime: new Date(doc.data().endTime.seconds * 1000),
        finishTime:
          doc.data().finishTime !== null
            ? new Date(doc.data().finishTime.seconds * 1000)
            : null,
        location: doc.data().location,
      });
    });

    const response = h.response({
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

const getUserActivityHandler = async (request, h) => {
  try {
    const {activityId} = request.params;

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

    const response = h.response({
      data: {
        activityId: userActivity.data().activityId,
        activityName: userActivity.data().activityName,
        description: userActivity.data().description,
        startTime: new Date(userActivity.data().startTime.seconds * 1000),
        endTime: new Date(userActivity.data().endTime.seconds * 1000),
        finishTime:
          userActivity.data().finishTime !== null
            ? new Date(userActivity.data().finishTime.seconds * 1000)
            : null,
        location: userActivity.data().location,
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

const updateUserActivityHandler = async (request, h) => {
  try {
    const {activityId} = request.params;
    const {
      activityName,
      description,
      startTime,
      endTime,
      location,
      finishTime,
    } = request.payload;

    // check request body payload
    if (
      !activityName &&
      !description &&
      !startTime &&
      !endTime &&
      !location &&
      !finishTime
    ) {
      const response = h.response({
        message: 'no content',
      });
      response.code(204);
      return response;
    }

    const userActivitiesRef = await db.collection('userActivities');
    const userActivity = await userActivitiesRef.doc(activityId).get();

    // check if activity exists
    if (!userActivity.exists) {
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
    if (location) {
      updatedActivity.location = Timestamp.fromDate(new Date(location));
    }
    if (finishTime) {
      updatedActivity.finishTime = Timestamp.fromDate(new Date(finishTime));
    }

    userActivitiesRef.doc(activityId).update(updatedActivity);

    const response = h.response({
      message: 'user activity successfully updated',
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

const deleteUserActivityHandler = async (request, h) => {
  try {
    const {activityId} = request.params;

    const userActivitiesRef = await db.collection('userActivities');
    const userActivity = await userActivitiesRef.doc(activityId).get();

    // check if activity exists
    if (!userActivity.exists) {
      const response = h.response({
        message: `activity ${activityId} does not exist`,
      });
      response.code(404);
      return response;
    }

    userActivitiesRef.doc(activityId).delete();

    const response = h.response({
      message: 'user activity successfully deleted',
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
  createUserActivityHandler,
  getAllUserActivitiesHandler,
  getUserActivityHandler,
  updateUserActivityHandler,
  deleteUserActivityHandler,
};
