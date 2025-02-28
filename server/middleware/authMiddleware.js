// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const SECRET_KEY = 'mySecretKey';

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Format: "Bearer token"
  if (!token) return res.sendStatus(401);

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.sendStatus(403); // Invalid token
    req.user = user;
    next();
  });
}

// RBAC: Check if the user's role is allowed
function authorizeRole(allowedRoles) {
  return (req, res, next) => {
    if (!req.user) return res.sendStatus(401);
    if (allowedRoles.includes(req.user.role)) {
      next();
    } else {
      res.sendStatus(403); // Forbidden
    }
  };
}

module.exports = { authenticateToken, authorizeRole };