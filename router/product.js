const {Router} = require('express')
const router = Router()
const auth = require('../middleware/auth')
const Product = require('../models/product')
const Subcategory = require('../models/subcategory')
const Category = require('../models/category')
const upload = require('../middleware/file')
const {populate} = require('../models/product')
router.get('/', auth, async (req, res) => {
  let product = await Product.find().sort({_id: -1}).populate({
    path: 'subcategory',
    populate: {
      path: 'category'
    }
  }).lean()
  const subcategory = await Subcategory.find().where({status: 1}).lean()
  const category = await Category.find().lean()
  product = product.map((prod, index) => {
    prod.class = prod.status == 0 ? 'bg-danger bg-gradient text-light' : 'bg-primary text-light'
    prod.status = (prod.status == 0) ? 'Отключено' : 'Активный'
    prod.price = prod.price.toLocaleString('fr')
    prod.index = index + 1
    return prod
  })
  res.render('product/product', {
    category,
    product,
    subcategory,
    error: req.flash('error'),
    success: req.flash('success')
  })
})
router.get('/delete/:id', auth, async (req, res) => {
  await Product.findByIdAndDelete(req.params.id)
  req.flash('error', 'Удалено.')
  res.redirect('/product')
})


router.post('/newproduct', auth, async(req, res) => {
  try {
    const {title, subcategory, price, status, comment, material} = req.body
    const product = await new Product({title, subcategory, price, status, comment, material})
    await product.save()
    req.flash('success', 'Продукт добавлен!')
    res.redirect('/product')
  } catch (error) {
    console.log(error);
  }
})

router.get('/change/:id', auth, async (req, res) => {
  let _id = req.params.id
  const product = await Product.findOne({_id}).lean()
  res.send(product)
})

router.post('/changes', auth, upload.fields([{name: 'img', maxCount: 4}]),
  async (req, res) => {
    try {
      let {_id, color, size} = req.body
      let {img} = req.files
      let image = []
      if(img){
        img.forEach(element => {
          image.push(element.path)
        });
      }
      let product = await Product.findOne({_id})
      product.inside.push({img: image, size: size, color: color})
      await Product.findByIdAndUpdate({_id}, product).lean()
      req.flash('success', 'Атрибут добавлен!')
      res.redirect('/product')
    } catch (error) {
      console.log(error);
  }
  })

router.get('/prodCat/:id', auth, async(req, res)=>{
  let _id = req.params.id
  const subcategory = await Subcategory.find({category: _id}).where({status: 1}).lean()
  res.send(subcategory)
})

router.get('/edit/:id', auth, async(req, res)=>{
  let _id = req.params.id
  const product = await Product.findOne({_id}).populate({
    path: 'subcategory',
    populate: {
      path: 'category'
    }
  }).lean()
  res.send(product)
})

router.get('/subCat/:id', auth, async(req, res)=>{
  let _id = req.params.id
  const subcategory = await Subcategory.find({category: _id}).where({status: 1}).lean()
  res.send(subcategory)
})

router.post('/save', auth, async(req, res)=>{
  try {
    let {title, subcategory, price, status, comment, material, category} = req.body
    let _id = req.body._id
    status = status || 0
    let product = ({title, subcategory, price, status, comment, material, category})
    await Product.findByIdAndUpdate({_id}, product).lean()
    req.flash('success', 'Данные успешно изменены.')
    res.redirect('/product')
  } catch (error) {
    console.log(error);
  }
})

router.get('/info/:id', auth, async(req, res)=>{
  let _id = req.params.id
  let product = await Product.findOne({_id}).populate({
    path: 'subcategory',
    populate: {
      path: 'category'
    }
  }).lean()
  const subcategory = await Subcategory.find().where({status: 1}).populate('category').lean()
  product.price = product.price.toLocaleString('fr')
  // product.img = product.img[0]
  let imgFirst = ''
  product.inside.forEach(element =>{
    imgFirst = element.img[0]
  })
  product.maininside = product.inside.img
  product.nextinside = product.inside[1]
  res.render('product/info', {
    product, subcategory, imgFirst
  })
})

router.get('/infoInside/:id', auth, async(req, res)=>{
  let _id = req.params.id
  // let index = req.params.index
  const product = await Product.findOne({_id}).populate({
    path: 'subcategory',
    populate: {
      path: 'category'
    }
  }).lean()
  res.send(product)
})

router.get('/infoInside/:id/:index', auth, async(req, res)=>{
  let _id = req.params.id
  let index = req.params.index
  const product = await Product.findOne({_id}).populate({
    path: 'subcategory',
    populate: {
      path: 'category'
    }
  }).lean()
  let fIndex = product.inside[index]
  res.send(fIndex)
})

router.post('/info/editAtr', auth, upload.fields([{name: 'img', maxCount: 4}]), 
  async(req, res)=>{
  try {
    let _id = req.body._id
    let index = req.body.index
    let {color, size} = req.body
    let image = []
    let product = await Product.findOne({_id})
    if(req.files){
      let {img} = req.files
      if(img){
        img.forEach(element =>{
          image.push(element.path)
        })
        product.inside[index] = {color, img: image, size}
      } else {
        product.inside[index].color = color
        product.inside[index].size = size
      }
    } 
    await Product.findByIdAndUpdate({_id}, product).lean()
    res.redirect(`/product/info/${_id}`)
  } catch (error) {
    console.log(error)
  }
})

router.get('/info/delete/:id/:index', auth, async(req, res)=>{
  const _id = req.params.id
  const index = req.params.index
  const product = await Product.findOne({_id}).lean()
  product.inside.splice(index, 1)
  await Product.findByIdAndUpdate(_id, product)
  res.redirect(`/product/info/${_id}`)
})


// API front 



module.exports = router