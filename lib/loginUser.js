const axios = require('axios');

/**
 * Authenticates a user against Keycloak using Resource Owner Password Credentials grant.
 * @param {Object} options
 * @param {string} options.username - The user's username/email/phone.
 * @param {string} options.password - The user's password.
 * @param {string} options.clientId - The Keycloak client ID.
 * @param {string} options.clientSecret - (Optional) Client secret, required if client is confidential.
 */
async function loginUser({ username, password, clientId, clientSecret, baseURL, realm }) {
  if (!username || !password || !clientId) {
    throw new Error('username, password, and clientId are required');
  }

  const payload = new URLSearchParams({
    grant_type: 'password',
    client_id: clientId,
    username,
    password
  });

  if (clientSecret) {
    payload.append('client_secret', clientSecret);
  }

  const res = await axios.post(
    `${baseURL}/realms/${realm}/protocol/openid-connect/token`,
    payload,
    {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    }
  );

  return res.data; // access_token, refresh_token, etc.
}

module.exports = loginUser;
