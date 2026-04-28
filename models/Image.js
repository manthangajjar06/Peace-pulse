const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  images: [{
    filename: {
      type: String,
      required: true
    },
    path: {
      type: String,
      required: true
    }
  }],
  caption: {
    type: String,
    default: ""
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  userName: {
    type: String,
    required: true
  },
  uploadedAt: {
    type: Date,
    default: Date.now
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  comments: [{
    text: {
      type: String,
      required: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    userName: {
      type: String,
      required: true
    },
    commentedAt: {
      type: Date,
      default: Date.now
    }
  }]
});

module.exports = mongoose.model('Image', imageSchema);