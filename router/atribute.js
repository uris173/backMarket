const {Router} = require('express')
const router = Router()
const auth = require('../middleware/auth')
const Subcategory = require('../models/subcategory')
const Atribute = require('../models/atribute')

router.get('/', auth, async(req, res)=>{
  let subcategory = await Subcategory.find().populate('category').lean()
  let atribute = await Atribute.find().sort({_id: 1}).populate({
    path:'subcategory',
    populate: {
      path:'category'
    }
  }).lean()
  atribute = atribute.map((cat, index)=>{
    cat.class = cat.status == 0 ? 'bg-danger bg-gradient text-light' : 'bg-primary text-light'
    cat.status = (cat.status == 0) ? 'Отключено' : 'Активный'
    cat.index = index + 1
    return cat
  })
  res.render('atribute/atribute',{
    subcategory,
    atribute
  })
})

router.post('/addAtribute', auth, async(req, res)=>{
  try {
    const {subcategory} = req.body
    const atribute = await new Atribute({})
    await atribute.save()
    res.redirect('/atribute')
  } catch (error) {
    console.log(error);
  }
})
router.post('/save', auth, async(req, res)=>{
  try {
    let {_id, subcategory, title, status} = req.body
    status = status || 0
    let atribute = {subcategory, title, status}
    await Atribute.findOneAndUpdate({_id}, atribute).lean()
    res.redirect('/atribute')
  } catch (error) {
    console.log(error);
  }
})

router.get('/delete/:id', auth, async(req, res)=>{
  await Atribute.findByIdAndDelete(req.params.id)
  res.redirect('/atribute')
})
router.get('/edit/:id', auth, async(req, res)=>{
  const _id = req.params.id
  const atribute = await Atribute.findOne({_id}).lean()
  res.send(atribute)
})

module.exports = router