const bcrypt = require('bcrypt');

function generateOTP(length = Number(process.env.OTP_LENGTH) || 6) {
  const digits = '0123456789';
  let otp = '';
  for (let i = 0; i < length; i++) otp += digits[Math.floor(Math.random() * 10)];
  return otp;
}

async function hashOTP(otp) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(otp, salt);
}

function expiryFromNow(minutes = Number(process.env.OTP_TTL_MINUTES) || 10) {
  return new Date(Date.now() + minutes * 60 * 1000);
}

module.exports = { generateOTP, hashOTP, expiryFromNow };
