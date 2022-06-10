const {Router} = require('express')
const router = Router() 
const Category = require('../models/category')
const Subcategory = require('../models/subcategory')
const Product = require('../models/product')
const auth = require('../middleware/auth')
router.get('/', auth, async (req,res)=>{
  const subcategoryCount = await Subcategory.find().count()
  const categoryCount = await Category.find().count()
  const productCount = await Product.find().count()
  let product = await Product.find().sort({_id: 1}).populate({
    path: 'subcategory',
    populate:{
      path: 'category'
    }
  }).limit(15).lean()
  let photo = ''
  // photo = product.inside
  product = product.map((prod, index) =>{
    prod.class = prod.status == 0 ? 'bg-danger bg-gradient text-light' : 'bg-primary text-light'
    prod.status = (prod.status == 0) ? 'Отключено' : 'Активный'
    prod.price = prod.price.toLocaleString('fr')
    prod.index = index + 1
    return prod
  })
  console.log(photo);

  res.render('index',{
    product,
    subcategoryCount, categoryCount, productCount
  })
})
router.get('/about', auth, (req,res)=>{
  res.render('about',{
  })
})

module.exports = router