const {Schema, model} = require('mongoose')

const admin = new Schema({
  name: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: Number,
    default: 2,
      // 0 -> superAdmin
      // 1 -> Boss
      // 2 -> Little Boss
      // 3 -> Capitan
      // 4 -> Sergant
      // 5 -> Soldier
  },
  // resetToken: String,
  // resetTokenExp: Date,
})

module.exports = model('Admin', admin)