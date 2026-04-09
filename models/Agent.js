const mongoose = require('mongoose');

const AgentSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  address: String,
  service: String,
  experience: Number,
  profilePic: String,
  kitPic: String,
  purpleStar: Boolean,
  status: { type: String, default: 'pending' } // pending/verified
});

module.exports = mongoose.model('Agent', AgentSchema);
