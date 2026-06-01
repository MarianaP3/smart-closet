const mongoose = require('mongoose');

const categorySchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    default: '',
  },
  legacyId: {
    type: String,
    unique: true,
    sparse: true,
  },
});

module.exports = mongoose.model('Category', categorySchema);
