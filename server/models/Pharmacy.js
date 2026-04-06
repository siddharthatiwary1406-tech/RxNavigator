const mongoose = require('mongoose');

const PharmacySchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: String,
  website: String,
  email: String,
  specialties: [String],
  drugs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Drug' }],
  states: [String],
  accreditations: [String],
  patientSupport: Boolean,
  hubServices: Boolean,
  address: {
    street: String,
    city: String,
    state: String,
    zip: String
  }
});

module.exports = mongoose.model('Pharmacy', PharmacySchema);
