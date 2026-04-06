const mongoose = require('mongoose');

const DrugSchema = new mongoose.Schema({
  brandName: { type: String, required: true, index: true },
  genericName: { type: String, required: true, index: true },
  manufacturer: String,
  therapeuticArea: String,
  indication: [String],
  hasREMS: { type: Boolean, default: false },
  remsProgram: {
    name: String,
    requirements: [String],
    enrollmentUrl: String,
    certificationRequired: { type: Boolean, default: false }
  },
  specialtyPharmacies: [{
    name: String,
    phone: String,
    website: String,
    states: [String]
  }],
  prescribingSteps: [String],
  requiredForms: [{
    name: String,
    url: String
  }],
  paRequirements: {
    general: [String],
    payers: [{
      name: String,
      steps: [String],
      criteria: [String],
      phone: String,
      portalUrl: String
    }]
  },
  fdaLabel: String,
  rxNormCode: String,
  lastVerified: { type: Date, default: Date.now },
  dataSource: [String]
});

DrugSchema.index({ brandName: 'text', genericName: 'text', therapeuticArea: 'text' });

module.exports = mongoose.model('Drug', DrugSchema);
