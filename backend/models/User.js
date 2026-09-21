const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    default: 'Campus Student'
  },
  phone: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    default: ''
  },
  avatar: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('User', UserSchema);
