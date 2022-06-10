const {Schema, model} = require('mongoose')

const category = new Schema({
  title:{
    type: String,
    required: true
  },
  slug:{
    type: String,
    required: true
  },
  img:{
    type: String
  },
  status:{
    type: Number,
    default: 0
  }
})

module.exports = model('Category', category)