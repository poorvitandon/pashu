const mongoose = require('mongoose');

const CattleSchema = new mongoose.Schema({
  digitalId: {
    type: String,
    required: true,
    unique: true,
    uppercase: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  breed: {
    type: String,
    required: true,
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  type: {
    type: String,
    enum: ['Cattle', 'Buffalo'],
    required: true
  },
  gender: {
    type: String,
    enum: ['Male', 'Female'],
    required: true
  },
  age: {
    type: Number,
    required: true,
    min: 0,
    max: 25
  },
  weight: {
    type: Number,
    required: true,
    min: 50,
    max: 1000
  },
  healthStatus: {
    type: String,
    enum: ['Excellent', 'Good', 'Fair', 'Poor'],
    default: 'Good'
  },
  milkYield: {
    type: String,
    trim: true
  },
  imageUrl: {
    type: String
  },
  qrCode: {
    type: String
  },
  vaccinations: [{
    name: String,
    date: Date,
    nextDue: Date,
    veterinarian: String
  }],
  healthRecords: [{
    date: Date,
    symptoms: String,
    diagnosis: String,
    treatment: String,
    veterinarian: String,
    cost: Number
  }],
  breedingHistory: [{
    date: Date,
    method: {
      type: String,
      enum: ['Natural', 'AI']
    },
    bullBreed: String,
    expectedCalving: Date,
    actualCalving: Date,
    offspring: {
      gender: String,
      weight: Number,
      healthStatus: String
    }
  }],
  registrationDate: {
    type: Date,
    default: Date.now
  },
  lastCheckup: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  },
  location: {
    latitude: Number,
    longitude: Number,
    address: String
  },
  insuranceDetails: {
    provider: String,
    policyNumber: String,
    coverage: Number,
    expiryDate: Date
  }
}, {
  timestamps: true
});

// Indexes for better query performance
CattleSchema.index({ userId: 1 });
CattleSchema.index({ digitalId: 1 });
CattleSchema.index({ breed: 1 });
CattleSchema.index({ healthStatus: 1 });

// Pre-save middleware to generate digital ID
CattleSchema.pre('save', function(next) {
  if (!this.digitalId) {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substr(2, 6).toUpperCase();
    this.digitalId = `IN-${timestamp}-${random}`;
  }
  next();
});

module.exports = mongoose.model('Cattle', CattleSchema);