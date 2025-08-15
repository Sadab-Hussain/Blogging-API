const createError = require('http-errors');
const User = require('../models/User');
const VerificationToken = require('../models/VerificationToken');
const { generateOTP, hashOTP, expiryFromNow } = require('../utils/otp');
const { sendOTPEmail } = require('../utils/email');
const { signAccess, signRefresh } = require('../utils/jwt');
const bcrypt = require('bcrypt');

exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return next(createError(400, 'Missing fields'));
    let user = await User.findOne({ email });
    if (user) return next(createError(409, 'Email already registered'));

    user = await User.create({ name, email, password });

    const otp = generateOTP();
    await VerificationToken.create({
      user: user._id,
      otpHash: await hashOTP(otp),
      expiresAt: expiryFromNow()
    });

    await sendOTPEmail(email, otp);

    res.status(201).json({ success: true, message: 'Registered. Check email for OTP.', userId: user._id });
  } catch (e) {
    next(e);
  }
};

exports.verifyEmail = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) return next(createError(400, 'Missing fields'));
    const user = await User.findOne({ email });
    if (!user) return next(createError(404, 'User not found'));
    const token = await VerificationToken.findOne({ user: user._id }).sort({ createdAt: -1 });
    if (!token || token.expiresAt < new Date()) return next(createError(400, 'OTP expired or not found'));
    const ok = await bcrypt.compare(otp, token.otpHash);
    if (!ok) return next(createError(400, 'Invalid OTP'));
    user.isEmailVerified = true;
    await user.save();
    await VerificationToken.deleteMany({ user: user._id });
    res.json({ success: true, message: 'Email verified' });
  } catch (e) {
    next(e);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return next(createError(400, 'Missing fields'));
    const user = await User.findOne({ email: email.trim().toLowerCase() }).select('+password');
    if (!user) return next(createError(401, 'Invalid credentials'));
    const passOk = await bcrypt.compare(password, user.password);
    if (!passOk) return next(createError(401, 'Invalid credentials'));
    if (!user.isEmailVerified) return next(createError(403, 'Email not verified'));
    const payload = { id: user._id, role: user.role };
    const accessToken = signAccess(payload);
    const refreshToken = signRefresh(payload);
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });
    res.json({
      success: true,
      accessToken,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (e) {
    next(e);
  }
};
