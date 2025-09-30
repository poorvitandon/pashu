const mongoose = require('mongoose');

const SchemeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  nameHi: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  descriptionHi: {
    type: String,
    required: true
  },
  eligibility: [{
    type: String,
    required: true
  }],
  eligibilityHi: [{
    type: String,
    required: true
  }],
  benefits: {
    type: String,
    required: true
  },
  benefitsHi: {
    type: String,
    required: true
  },
  applicableBreeds: [{
    type: String,
    required: true
  }],
  ministry: {
    type: String,
    required: true
  },
  applicationUrl: {
    type: String,
    required: true
  },
  deadline: {
    type: Date
  },
  subsidy: {
    type: String
  },
  maxAmount: {
    type: Number
  },
  processingTime: {
    type: String
  },
  requiredDocuments: [{
    type: String
  }],
  contactInfo: {
    phone: String,
    email: String,
    address: String
  },
  isActive: {
    type: Boolean,
    default: true
  },
  applicableStates: [{
    type: String
  }],
  targetBeneficiaries: [{
    type: String
  }]
}, {
  timestamps: true
});

// Indexes for better query performance
SchemeSchema.index({ applicableBreeds: 1 });
SchemeSchema.index({ isActive: 1 });
SchemeSchema.index({ deadline: 1 });

module.exports = mongoose.model('Scheme', SchemeSchema);