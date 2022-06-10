module.exports = (req, res, next)=>{
  res.locals.isAuth = req.session.isAuthed
  res.locals.csrf = req.csrfToken()
  // if (req.session.admin.name)
  res.locals.admin = req.session.admin
  next()
}
