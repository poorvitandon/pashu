const mongoose = require('mongoose');

const VeterinaryOfficerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  qualification: {
    type: String,
    required: true
  },
  registrationNumber: {
    type: String,
    required: true,
    unique: true
  },
  phone: {
    type: String,
    required: true,
    match: /^[+]?[0-9]{10,15}$/
  },
  email: {
    type: String,
    required: true,
    lowercase: true
  },
  address: {
    type: String,
    required: true
  },
  district: {
    type: String,
    required: true
  },
  state: {
    type: String,
    required: true
  },
  pincode: {
    type: String,
    match: /^[0-9]{6}$/
  },
  specialization: [{
    type: String,
    required: true
  }],
  availability: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  totalRatings: {
    type: Number,
    default: 0
  },
  experience: {
    type: String,
    required: true
  },
  languages: [{
    type: String,
    required: true
  }],
  services: [{
    name: String,
    description: String,
    cost: Number
  }],
  workingHours: {
    monday: { start: String, end: String },
    tuesday: { start: String, end: String },
    wednesday: { start: String, end: String },
    thursday: { start: String, end: String },
    friday: { start: String, end: String },
    saturday: { start: String, end: String },
    sunday: { start: String, end: String }
  },
  emergencyAvailable: {
    type: Boolean,
    default: false
  },
  profileImage: {
    type: String
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  location: {
    latitude: Number,
    longitude: Number
  }
}, {
  timestamps: true
});

// Indexes for better query performance
VeterinaryOfficerSchema.index({ state: 1, district: 1 });
VeterinaryOfficerSchema.index({ specialization: 1 });
VeterinaryOfficerSchema.index({ rating: -1 });
VeterinaryOfficerSchema.index({ isActive: 1, isVerified: 1 });

module.exports = mongoose.model('VeterinaryOfficer', VeterinaryOfficerSchema);