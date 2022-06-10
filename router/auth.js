const {Router} = require('express')
const router = Router()
const Admin = require('../models/admin')
const bcrypt = require('bcryptjs')
const { findOne } = require('../models/user')

router.get('/', async(req, res)=>{
  // console.log(session);
  res.render('auth/auth',{
    layout: 'nohead',
    error: req.flash('error'),
    success: req.flash('success')
  })
})
router.get('/logout', (req, res) => {
  req.session.admin.name
  res.redirect('/auth')
})
router.get('/astora', async(req, res)=>{
  let check = await Admin.findOne({name: 'admin'})
  if(check){
    res.redirect('/auth')
  } else{
    const hashPass = await bcrypt.hash('12345', 10)
    let admin = await new Admin({name: 'astora', password: hashPass, role: 0})
    await admin.save()
    res.redirect('/')
  }
})
router.post('/', async(req, res)=>{
  const {name, password} = req.body
  const maybeAdm = await Admin.findOne({name}).lean()
  if(maybeAdm){
    const comparePass = await bcrypt.compare(password, maybeAdm.password)
    if(comparePass){
      req.session.admin = maybeAdm
      req.session.isAuthed = true
      req.session.save((err)=>{
        if(err) throw err
        else res.redirect('/')
      })
    }else{
      req.flash('error', 'Неверный пароль')
      res.redirect('/auth')
    }
  } else {
    req.flash('error', 'Такого пользователя нет в системе.')
    res.redirect('/auth')
  }
})


module.exports = router