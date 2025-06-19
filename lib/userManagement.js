const getClient = require('./keycloakClient');
// Get all users with a specific client role
exports.getUsersByClientRole = async (clientId, roleName) => {
  const client = await getClient();

  const usersRes = await client.get('/users');
  const users = usersRes.data;

  const filteredUsers = [];

  for (const user of users) {
    const roleMappings = await client.get(`/users/${user.id}/role-mappings/clients/${clientId}`);
    const roles = roleMappings.data || [];

    if (roles.some(role => role.name === roleName)) {
      filteredUsers.push(user);
    }
  }

  return filteredUsers;
};

// Reset password for a user
exports.resetPassword = async ({ userId, newPassword, clientId, clientSecret, baseURL, realm }) => {
  if (!userId || !newPassword || !clientId || !clientSecret) {
    throw new Error('userId, newPassword, clientId, and clientSecret are required');
  }

  // Get an authenticated Keycloak admin client
  const client = await getClient(clientId, clientSecret, baseURL, realm);

  // Optional: Confirm user exists
  const { data: user } = await client.get(`/users/${userId}`);
  if (!user || !user.id) {
    throw new Error('User not found in Keycloak');
  }

  // Reset password
  await client.put(`/users/${userId}/reset-password`, {
    type: 'password',
    value: newPassword,
    temporary: false,
  });

  return { success: true, message: 'Password successfully reset' };
};

// Send email verification
exports.sendVerificationEmail = async (userId) => {
  const client = await getClient();
  await client.put(`/users/${userId}/send-verify-email`);
};

// Deactivate a user
exports.deactivateUser = async (userId) => {
  const client = await getClient();
  await client.put(`/users/${userId}`, { enabled: false });
};

// Activate a user
exports.activateUser = async (userId) => {
  const client = await getClient();
  await client.put(`/users/${userId}`, { enabled: true });
};

// Find a user by email or any custom attributes (e.g., phone, nationalId)
exports.findUserByEmailOrAttributes = async (identifier, attributesToCheck = ['phone']) => {
  const client = await getClient();

  const usersRes = await client.get('/users');
  const users = usersRes.data;

  return users.find(user =>
    user.email === identifier ||
    attributesToCheck.some(attr =>
      Array.isArray(user.attributes?.[attr]) &&
      user.attributes[attr].includes(identifier)
    )
  );
};

// Send reset password email
exports.sendResetPasswordEmail = async (userId) => {
  const client = await getClient();
  await client.put(`/users/${userId}/execute-actions-email`, {
    actions: ['UPDATE_PASSWORD'],
    lifespan: 86400, // 24 hours
  });
};
