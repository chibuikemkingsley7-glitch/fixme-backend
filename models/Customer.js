const mongoose = require('mongoose');

const CustomerSchema = new mongoose.Schema({
  email: String,
  password: String
});

module.exports = mongoose.model('Customer', CustomerSchema);
