const {Router} = require('express')
const router = Router()
const Category = require('../models/category')
const Product = require('../models/product')
const Subcategory = require('../models/subcategory')
const upload = require('../middleware/file')
const auth = require('../middleware/auth')

router.get('/', auth, async(req, res)=>{
  let category = await Category.find().sort({_id: -1}).lean()
  category = category.map((cat, index)=>{
    cat.class = cat.status == 0 ? 'bg-danger bg-gradient text-light' : 'bg-primary text-light'
    cat.status = (cat.status == 0) ? 'Отключено' : 'Активный'
    cat.index = index + 1
    return cat
  })
  
  res.render('category/category',{
    category
  })
})
router.post('/addCategory', auth, upload.single('img'), async(req, res)=>{
  try {
    let {title, status, slug} = req.body
    let img = ''
    if(req.file){
      img = req.file.path
    }
    // title = title.toLowerCase()
    const category = await new Category({title, status, slug, img})
    await category.save()
    res.redirect('/category')
  } catch (error) {
    console.log(error);
  }
})
router.post('/save', auth, upload.single('img'), async(req, res)=>{
  try {
    let _id = req.body._id
    let {title, status, slug} = req.body
    let img = ''
    // let cat = ({title, status, slug, img})
    let category = await Category.findOne({_id})
    if(req.file){
      img = req.file.path
      category = {title, status, slug, img}
    } else{
      category.title = title
      category.status = status || 0
      category.slug = slug
    }
    await Category.findByIdAndUpdate({_id}, category).lean()
    console.log();
    res.redirect('/category')
  } catch (error) {
    console.log(error);
  }
})
router.get('/delete/:id', auth, async(req, res)=>{
  await Category.findByIdAndDelete(req.params.id)
  res.redirect('/category')
})

router.get('/edit/:id', auth, async(req, res)=>{
  const _id = req.params.id
  const category = await Category.findOne({_id}).lean()
  res.send(category)
})




module.exports = router