const {Router} = require('express')
const router = Router()
const auth = require('../middleware/auth')
const Admin = require('../models/admin')
const bcrypt = require('bcryptjs')

router.get('/', auth, async(req, res)=>{
  let adm = await Admin.find().lean()
  if(req.session.admin.role == 1){
    res.redirect('/')
  }
  if(req.session.admin.role == 2){
    res.redirect('/')
  }
  adm = adm.map((admin)=>{
    admin.role = (admin.role == 0) ? 'Администратор первого уровня' : (admin.role == 1) ? 'Администратор второго уровня' : (admin.role == 2) ? 'Администратор третьего уровня' : ''
    return admin
  })
  res.render('admin/admin',{
    error: req.flash('error'),
    success: req.flash('success'),
    adm,
  })
})
router.post('/create', auth, async(req, res)=>{
  const {name, password, role} = req.body
  const hashPass = await bcrypt.hash(password, 10)
  const admin = await new Admin({name, password: hashPass, role})
  await admin.save()
  req.flash('success', 'Админ добавлен!')
  res.redirect('/admin')
})
router.get('/delete/:id', auth, async(req, res)=>{
  await Admin.findByIdAndDelete(req.params.id)
  req.flash('error', 'Удалено.')
  res.redirect('/admin')
})
router.get('/editAdm/:id', auth, async(req, res)=>{
  const _id = req.params.id
  const admin = await Admin.findOne({_id}).lean()
  res.send(admin)
})
router.post('/edit', auth, async(req, res)=>{
  let {_id, name, password, role} = req.body
  let hashPass = await bcrypt.hash(password, 10)
  let adm = {name, password: hashPass, role}
  await Admin.findByIdAndUpdate({_id}, adm).lean()
  req.flash('success', 'Изменено.')
  res.redirect('/admin')
})


module.exports = router