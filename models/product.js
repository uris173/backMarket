const {Schema, model} = require('mongoose')

const product = new Schema({
  title:{
    type: String,
    required: true
  },
  price: {
    type: Number
  },
  status: {
    type: Number,
    default: 0
  },
  comment: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now()
  },
  material: {
    type: String
  },
  // products: Array,
  inside: [{
    color: String,
    img: [String],
    size: [String]
  }],
  subcategory: {
    type: Schema.Types.ObjectId,
    ref: 'Subcategory'
  }
})

module.exports = model('Product', product)