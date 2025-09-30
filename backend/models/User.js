const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  phone: {
    type: String,
    required: true,
    unique: true,
    match: /^[0-9]{10}$/
  },
  aadhaar: {
    type: String,
    unique: true,
    sparse: true,
    match: /^[0-9]{12}$/
  },
  state: {
    type: String,
    required: true,
    trim: true
  },
  district: {
    type: String,
    required: true,
    trim: true
  },
  village: {
    type: String,
    trim: true
  },
  pincode: {
    type: String,
    match: /^[0-9]{6}$/
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  profileImage: {
    type: String
  },
  language: {
    type: String,
    enum: ['en', 'hi'],
    default: 'en'
  },
  registrationDate: {
    type: Date,
    default: Date.now
  },
  lastLogin: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes for better query performance
UserSchema.index({ phone: 1 });
UserSchema.index({ aadhaar: 1 });
UserSchema.index({ state: 1, district: 1 });

module.exports = mongoose.model('User', UserSchema);