const axios = require('axios');

/**
 * Returns a Keycloak admin token using provided client credentials.
 * @param {string} clientId - The Keycloak confidential client ID.
 * @param {string} clientSecret - The client secret.
 */
async function getAdminToken(clientId, clientSecret, baseURL, realm) {
  const res = await axios.post(
    `${baseURL}/realms/${realm}/protocol/openid-connect/token`,
    new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: clientId,
      client_secret: clientSecret,
    }),
    {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    }
  );
  return res.data.access_token;
}

/**
 * Returns an Axios Keycloak client using provided client credentials.
 * @param {string} clientId - The Keycloak confidential client ID.
 * @param {string} clientSecret - The client secret.
 */
async function getKeycloakClient(clientId, clientSecret, baseURL, realm) {
  const token = await getAdminToken(clientId, clientSecret, baseURL, realm);

  return axios.create({
    baseURL: `${baseURL}/admin/realms/${realm}`,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
}

module.exports = getKeycloakClient;
