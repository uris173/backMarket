const {Router} = require('express')
const router = Router() 
const Category = require('../models/category')
const auth = require('../middleware/auth')
const Subcategory = require('../models/subcategory')

router.get('/', auth, async(req, res)=>{
  let subcategory = await Subcategory.find().sort({_id: -1}).populate('category').lean()
  const category = await Category.find().lean()
  subcategory = subcategory.map((cat, index)=>{
    cat.class = cat.status == 0 ? 'bg-danger bg-gradient text-light' : 'bg-primary text-light'
    cat.status = (cat.status == 0) ? 'Отключено' : 'Активный'
    cat.index = index + 1
    return cat
  })
  res.render('subcategory/subcategory',{
    subcategory,
    category,
    error: req.flash('error'),
    success: req.flash('success')
  })
})

router.post('/addSubcategory', auth, async(req, res)=>{
  try {
    const {subTitle, status, category, slug} = req.body
    const haveSubcategory = await Subcategory.findOne({
      $and: [
        {
          $or:[  // false
            {'subTitle':subTitle},
            {'slug':slug},
          ]
        },
        { // true
          'category': category
        }
      ]})
  if(haveSubcategory){
    req.flash('error', "Субкатегория с таким значением уже существует!")
  }else{
    const subcategory = await new Subcategory({subTitle, status, category, slug})
    await subcategory.save()
    req.flash('success', 'Субкатегория добавлена!')
  }
    res.redirect('/subcategory')
  } catch (error) {
    console.log(error);
  }
})

router.post('/save', auth, async(req, res)=>{
  try {
    let {subTitle, status, category, slug} = req.body
    let _id = req.body._id
    status = status || 0
    const haveSubcategory = await Subcategory.findOne({
      $and: [
        {
          $and: [
            {
              $or:[
                {'subTitle':subTitle},
                {'slug':slug},
              ]
            },
            {
              'category': category
            }
          ]
        },
        {
          _id: { $nin: _id}
        }
      ]
  })
    if(haveSubcategory){
      req.flash('error', 'Субкатегория с таким значением уже существует.')
    }else{
      let subCat = {subTitle, status, category, slug}
      await Subcategory.findByIdAndUpdate({_id}, subCat).lean()
      req.flash('success', 'Данные успешно добавлены!')
    }
    res.redirect('/subcategory')
  } catch (error) {
    console.log(error);
  }
})

router.get('/delete/:id', auth, async(req, res)=>{
  await Subcategory.findByIdAndDelete(req.params.id)
  req.flash('error', 'Удалено.')
  res.redirect('/subcategory')
})
router.get('/edit/:id', async(req, res)=>{
  const _id = req.params.id
  const subcategory = await Subcategory.findOne({_id}).lean()
  res.send(subcategory)
})




module.exports = router