// Lightweight email util: tries to use nodemailer if SMTP configured,
// otherwise falls back to console.log (useful for local dev).
const nodemailer = require('nodemailer');

async function sendOTPEmail(to, otp) {
  if (process.env.SMTP_HOST && process.env.SMTP_USER) {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
    });
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject: 'Your verification code',
      text: `Your verification code is ${otp}.`,
      html: `<p>Your verification code is <b>${otp}</b>.</p>`
    });
    return info.messageId;
  } else {
    console.log(`(email) To: ${to} — OTP: ${otp}`);
    return null;
  }
}

module.exports = { sendOTPEmail };
