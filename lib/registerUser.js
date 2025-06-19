const getClient = require('./keycloakClient');

async function registerUser({ email, username, password, clientId, clientSecret, role = 'user', attributes = {}, baseURL, realm }) {
  if (!clientId || !clientSecret) {
    throw new Error('clientId and clientSecret are required for Keycloak registration');
  }

  const client = await getClient(clientId, clientSecret, baseURL, realm);

  // Check if user exists
  const existingUsers = await client.get('/users', { params: { email } });
  let userId;

  if (existingUsers.data.length > 0) {
    // User exists
    userId = existingUsers.data[0].id;
  } else {
    // Create user with dynamic attributes
    const userRes = await client.post('/users', {
      username,
      email,
      enabled: true,
      attributes: attributes // accepts any custom fields like phone, firstname, etc.
    });

    userId = userRes.headers.location.split('/').pop();

    // Set password
    await client.put(`/users/${userId}/reset-password`, {
      type: 'password',
      value: password,
      temporary: false
    });
  }

  // Fetch client UUID
  const kcClients = await client.get('/clients', { params: { clientId } });
  const clientUUID = kcClients.data[0]?.id;
  if (!clientUUID) throw new Error('Client not found');

  // Get client roles
  const roles = await client.get(`/clients/${clientUUID}/roles`);
  const matchedRole = roles.data.find(r => r.name === role);
  if (!matchedRole) throw new Error(`Role ${role} not found`);

  // Assign role to user
  await client.post(`/users/${userId}/role-mappings/clients/${clientUUID}`, [matchedRole]);

  return { success: true, userId };
}

module.exports = registerUser;
