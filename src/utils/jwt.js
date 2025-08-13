const jwt = require('jsonwebtoken');

const signAccess = (payload) => jwt.sign(payload, process.env.JWT_ACCESS_SECRET || 'access_secret', { expiresIn: process.env.JWT_ACCESS_EXPIRES || '15m' });
const signRefresh = (payload) => jwt.sign(payload, process.env.JWT_REFRESH_SECRET || 'refresh_secret', { expiresIn: process.env.JWT_REFRESH_EXPIRES || '7d' });
const verifyAccess = (token) => jwt.verify(token, process.env.JWT_ACCESS_SECRET || 'access_secret');
const verifyRefresh = (token) => jwt.verify(token, process.env.JWT_REFRESH_SECRET || 'refresh_secret');

module.exports = { signAccess, signRefresh, verifyAccess, verifyRefresh };
