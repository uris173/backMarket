const {Schema, model} = require('mongoose')

const atribute = new Schema({
  price: {
    type: Number,
  },
  status: {
    type: Number,
    default: 0
  },
  text: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now()
  },
  material: {
    type: String,
  },
  subcategory: {
    type: Schema.Types.ObjectId,
    ref: 'Subcategory'
  }
})

module.exports = model('Atribute', atribute)