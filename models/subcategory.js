const {Schema, model} = require('mongoose')

const subcategory = new Schema({
  subTitle:{
    lowercase: true,
    type: String,
    // required: true
  },
  slug:{
    lowercase: true,
    type: String,
    required: true,
    // unique: true
  },
  status:{
    type: Number,
    default: 0
  },
  category:{
    type: Schema.Types.ObjectId,
    ref: 'Category'
  }
})

module.exports = model('Subcategory', subcategory)