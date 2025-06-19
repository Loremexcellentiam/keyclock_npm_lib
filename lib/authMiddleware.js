const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');

/**
 * Create an authentication middleware for Keycloak-protected routes.
 * @param {Object} options
 * @param {string} options.baseUrl - The base URL of the Keycloak server.
 * @param {string} options.realm - The Keycloak realm.
 * @param {string[]} [options.requiredRoles=[]] - Roles required to access the route.
 * @param {string} options.clientId - The client ID to validate resource access.
 */
const authMiddleware = ({ baseUrl, realm, requiredRoles = [], clientId }) => {
  const client = jwksClient({
    jwksUri: `${baseUrl}/realms/${realm}/protocol/openid-connect/certs`
  });

  function getKey(header, callback) {
    client.getSigningKey(header.kid, (err, key) => {
      if (err) return callback(err);
      const signingKey = key.getPublicKey();
      callback(null, signingKey);
    });
  }

  return (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Missing token' });
    }

    const token = authHeader.split(' ')[1];

    jwt.verify(token, getKey, {
      audience: clientId,
      issuer: `${baseUrl}/realms/${realm}`
    }, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: 'Invalid token', error: err.message });
      }

      const roles = decoded?.resource_access?.[clientId]?.roles || [];
      if (requiredRoles.length > 0 && !requiredRoles.some(r => roles.includes(r))) {
        return res.status(403).json({ message: 'Access denied' });
      }

      req.user = {
        id: decoded.sub,
        email: decoded.email,
        roles,
        username: decoded.preferred_username,
      };

      next();
    });
  };
};

module.exports = authMiddleware;
