const {Router} = require('express')
const router = Router()
const Category = require('../models/category')
const Product = require('../models/product')
const Subcategory = require('../models/subcategory')
const upload = require('../middleware/file')
const auth = require('../middleware/auth')
const product = require('../models/product')

router.get('/all', async(req, res)=>{
  let category = await Category.find().select(['title', 'img', 'slug']).lean()
  category = category.map(cat => {
    cat.img  = cat.img.split('image\\').join('')
    return cat
  })
  res.send(category)
  // Для получеия категории Man and Woman
})

router.get('/subcat/:id', async(req, res)=>{
  let categoryId = req.params.id
  let categoryMale = await Category.findOne({categoryId}).lean()
  let subcategory = await Subcategory.find({category: categoryMale}).select(['subTitle', 'slug']).where({status: 1}).lean()
  console.log(subcategory);
  res.send(subcategory)
  // Для получени Субкатегориев в зависимотсти от Категория
})

// router.get('/getSub/', async(req, res)=>{
//   let sub = req.query.sub
//   let subcategory = await Subcategory.findOne({slug: sub}).lean()
//   let product = await Product.find({subcategory}).select(['title', 'price', 'inside']).where({status: 1}).lean()
//   product = product.map(prod =>{
//     prod.img = prod.inside[0].img[0]
//     prod.color = prod.inside.length
//     prod.img  = prod.img.split('image\\').join('')
//     return prod
//   })
//   // Для получения Товаров при изменении Субкатегориев
//   res.send(product)
// })

// router.get('/:id', async(req, res)=>{
//   let categoryId = req.params.id
//   let categoryMale = await Category.findOne({categoryId}).lean()
//   let subcategory = await Subcategory.find({category: categoryMale._id}).populate('category').lean()
//   // console.log(categoryId);
//   let product = await Product.find({subcategory}).select(['title', 'price', 'inside']).where({status: 1}).lean()
//   product = product.map(prod =>{
//     prod.img = prod.inside[0].img[0]
//     prod.color = prod.inside.length
//     prod.img  = prod.img.split('image\\').join('')
//     return prod
//   })
//   res.send(product)
//   // Для получения Slug и надлежащик к Категории - Субкатегории и принадлежащие Продукты
// })


module.exports = router