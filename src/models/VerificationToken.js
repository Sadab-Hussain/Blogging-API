const { Schema, model, Types } = require('mongoose');

const verificationTokenSchema = new Schema({
  user: { type: Types.ObjectId, ref: 'User', required: true, index: true },
  otpHash: { type: String, required: true },
  expiresAt: { type: Date, required: true, index: true },
  attempts: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = model('VerificationToken', verificationTokenSchema);
