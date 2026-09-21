const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Electronics', 'Books', 'ID Cards', 'Bags', 'Clothing', 'Keys', 'Others']
  },
  type: {
    type: String,
    required: true,
    enum: ['LOST', 'FOUND']
  },
  image: {
    type: String,
    default: ''
  },
  location: {
    type: String,
    required: true
  },
  date: {
    type: String,
    required: true
  },
  userId: {
    type: String,
    required: true
  },
  userName: {
    type: String,
    default: 'Anonymous'
  },
  userPhone: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['ACTIVE', 'RESOLVED'],
    default: 'ACTIVE'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Item', ItemSchema);
