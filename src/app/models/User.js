const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User = new Schema({
  fullname: { type: String, required: true },
  username: { type: String, required: true,},
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  gender: { type: String, enum: ['male', 'female', 'other'] },
  avatar: { type: String, default: '/img/default-avatar.png' },
  role: { type: String, enum: ['admin', 'moderator', 'user'], default: 'user' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('User', User);