const {Router} = require('express')
const router = Router()
const auth = require('../middleware/auth')

router.get('/', auth, async(req, res)=>{
  if(req.session.admin.role == 2){
    res.redirect('/')
  }
  res.render('users/users')
})



module.exports = router