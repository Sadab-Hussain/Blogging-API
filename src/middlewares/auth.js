const createError = require('http-errors');
const { verifyAccess } = require('../utils/jwt');

function auth(required = true) {
  return (req, res, next) => {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (!token) return required ? next(createError(401, 'Missing token')) : next();
    try {
      const payload = verifyAccess(token);
      req.user = { id: payload.id, role: payload.role };
      next();
    } catch (e) {
      next(createError(401, 'Invalid or expired token'));
    }
  }
}

module.exports = auth;
