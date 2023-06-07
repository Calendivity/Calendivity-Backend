const {db} = require('../../firestore');

const createGroupHandler = async (request, h) => {
  const {groupName, description, users} = request.payload;

  // check should have at least two users
  if (users.length < 2) {
    const response = h.response({
      message: 'should have at least two users',
    });
    response.code(400);
    return response;
  }

  // check all users should be registered
  const unregisteredUser = [];
  await Promise.all(
    users.map(async (user) => {
      const userRes = await db.collection('users').doc(user).get();
      if (!userRes.exists) {
        unregisteredUser.push(user);
      }
    }),
  );
  if (unregisteredUser.length > 0) {
    const response = h.response({
      message: 'all users should be registered',
      unregisteredUser: unregisteredUser,
    });
    response.code(400);
    return response;
  }

  // create a new group with autogenerated id
  const groupRes = await db.collection('groups').add({
    groupName: groupName,
    description: description,
  });
  // update the groupId property
  db.collection('groups').doc(groupRes.id).update({
    groupId: groupRes.id,
  });
  // add registered users to new group
  users.push(request.authUser.email);
  users.map(async (user, index) => {
    const membershipRes = await db.collection('memberships').add({
      groupId: groupRes.id,
      role: index === users.length - 1 ? 'admin' : 'member',
      userId: user,
    });
    db.collection('memberships').doc(membershipRes.id).update({
      membershipId: membershipRes.id,
    });
  });
  const response = h.response({
    message: `group ${groupName} successfully created`,
    groupId: groupRes.id,
    groupName: groupName,
  });
  response.code(201);
  return response;
};

const getGroupHandler = async (request, h) => {
  const {groupId} = request.params;

  const groupRef = await db.collection('groups');
  const groupSnapshot = await groupRef.where('groupId', '==', groupId).get();

  // check the group is available
  if (groupSnapshot.empty) {
    const response = h.response({
      message: `group ${groupId} is not exist`,
    });
    response.code(400);
    return response;
  }
  // get group by id
  const groups = [];
  groupSnapshot.forEach((doc) => {
    groups.push(doc.data());
  });

  const response = h.response({
    message: 'group is successfully retrieved',
    Data: groups,
  });
  response.code(200);
  return response;
};

const updateGroupHandler = async (request, h) => {
  const adminId = request.authUser.email;
  const {groupId} = request.params;
  const {groupName, description} = request.payload;

  // check the group is available
  const groupRef = await db.collection('groups');
  const groupSnapshot = await groupRef.where('groupId', '==', groupId).get();
  if (groupSnapshot.empty) {
    const response = h.response({
      message: `group ${groupId} is not exist`,
    });
    response.code(400);
    return response;
  }

  // check the updater should be an admin
  const membershipRef = await db.collection('memberships');
  const adminSnapshot = await membershipRef
    .where('role', '==', 'admin')
    .where('userId', '==', adminId)
    .where('groupId', '==', groupId)
    .get();
  if (adminSnapshot.empty) {
    const response = h.response({
      message: `you are not an admin of ${groupId} group`,
    });
    response.code(400);
    return response;
  }

  // check the undefined properties
  const updateGroup = {};
  if (groupName) {
    updateGroup.groupName = groupName;
  }
  if (description) {
    updateGroup.description = description;
  }

  groupRef.doc(groupId).update(updateGroup);

  const response = h.response({
    message: 'group is successfully updated',
  });
  response.code(200);
  return response;
};

const deleteGroupHandler = async (request, h) => {
  const adminId = request.authUser.email;
  const {groupId} = request.params;

  // check the group is available
  const groupRef = await db.collection('groups');
  const groupSnapshot = await groupRef.where('groupId', '==', groupId).get();
  if (groupSnapshot.empty) {
    const response = h.response({
      message: `group ${groupId} is not exist`,
    });
    response.code(400);
    return response;
  }

  // check the deleter should be an admin
  const membershipRef = await db.collection('memberships');
  const adminSnapshot = await membershipRef
    .where('role', '==', 'admin')
    .where('userId', '==', adminId)
    .where('groupId', '==', groupId)
    .get();
  if (adminSnapshot.empty) {
    const response = h.response({
      message: `you are not an admin of ${groupId} group`,
    });
    response.code(400);
    return response;
  }

  // delete group
  groupRef.doc(groupId).delete();

  const response = h.response({
    message: 'group is successfully deleted',
  });
  response.code(200);
  return response;
};

const inviteToGroupHandler = async (request, h) => {
  const adminId = request.authUser.email;
  const {groupId} = request.params;
  const {users} = request.payload;

  // check the inviter should be an admin
  const membershipRef = await db.collection('memberships');
  const adminSnapshot = await membershipRef
    .where('role', '==', 'admin')
    .where('userId', '==', adminId)
    .where('groupId', '==', groupId)
    .get();
  if (adminSnapshot.empty) {
    const response = h.response({
      message: `you are not an admin of ${groupId} group`,
    });
    response.code(400);
    return response;
  }

  // check all users should be registered
  const unregisteredUser = [];
  await Promise.all(
    users.map(async (user) => {
      const userRes = await db.collection('users').doc(user).get();
      if (!userRes.exists) {
        unregisteredUser.push(user);
      }
    }),
  );
  if (unregisteredUser.length > 0) {
    const response = h.response({
      message: 'all invited users should be registered',
      unregisteredUser: unregisteredUser,
    });
    response.code(400);
    return response;
  }

  const newUsers = [];
  await Promise.all(
    users.map(async (user) => {
      const userSnapshot = await membershipRef
        .where('userId', '==', user)
        .where('groupId', '==', groupId)
        .get();
      // check if the new user not in the group
      if (userSnapshot.empty) {
        newUsers.push(user);
        const membershipRes = await membershipRef.add({
          groupId: groupId,
          role: 'member',
          userId: user,
        });
        db.collection('memberships').doc(membershipRes.id).update({
          membershipId: membershipRes.id,
        });
      }
    }),
  );
  const response = h.response({
    message: 'all invited users are successfully added to the group',
    newUsers: newUsers,
  });
  response.code(201);
  return response;
};

const removeFromGroupHandler = async (request, h) => {
  const adminId = request.authUser.email;
  const {groupId} = request.params;
  const {userId} = request.query;

  if (!userId) {
    const response = h.response({
      message: 'missing query: userId',
    });
    response.code(400);
    return response;
  }

  // check the remover should be an admin
  const membershipRef = await db.collection('memberships');
  const adminSnapshot = await membershipRef
    .where('role', '==', 'admin')
    .where('userId', '==', adminId)
    .where('groupId', '==', groupId)
    .get();
  if (adminSnapshot.empty) {
    const response = h.response({
      message: `you are not an admin of ${groupId} group`,
    });
    response.code(400);
    return response;
  }

  const userSnapshot = await membershipRef
    .where('userId', '==', userId)
    .where('groupId', '==', groupId)
    .get();
  // check is the user exists in the group
  if (userSnapshot.empty) {
    const response = h.response({
      message: `user ${userId} not exists in ${groupId} group`,
    });
    response.code(400);
    return response;
  }
  userSnapshot.forEach((doc) => {
    membershipRef.doc(doc.id).delete();
  });
  const response = h.response({
    message: `user ${userId} successfully removed from ${groupId} group`,
  });
  response.code(200);
  return response;
};

const getGroupUsersHandler = async (request, h) => {
  const {groupId} = request.params;

  // Get user with group ID's parameter from Membership
  const groupsRef = await db.collection('memberships');
  const snapshotGroup = await groupsRef.where('groupId', '==', groupId).get();

  const users = [];
  snapshotGroup.forEach((doc) => {
    users.push(doc.data().userId);
  });

  // Get data from database collection users
  const getDataUsers = [];
  await Promise.all(
    users.map(async (userId) => {
      const userRes = await db.collection('users').doc(userId).get();
      getDataUsers.push(userRes.data());
    }),
  );

  const userNameEmail = getDataUsers.map((data) => {
    return {
      name: data.name,
      email: data.email,
    };
  });

  const response = h.response({
    message: `This Group have ${getDataUsers.length} members:`,
    data: userNameEmail,
  });
  return response;
};

module.exports = {
  createGroupHandler,
  getGroupHandler,
  inviteToGroupHandler,
  removeFromGroupHandler,
  getGroupUsersHandler,
  updateGroupHandler,
  deleteGroupHandler,
};
