// const cookieSession = require('cookie-session')
const express = require('express') 
const exphbs = require('express-handlebars')
const mongoose = require('mongoose')
const session = require('express-session')
const csrf = require('csurf') 
const bodyParser = require('body-parser')
const MongoStore = require('connect-mongodb-session')(session)
const flash = require('connect-flash')

const routerPage = require('./router/page')
const categoryPage = require('./router/category')
const subcategoryPage = require('./router/subcategory')
const atributePage = require('./router/atribute')
const productPage = require('./router/product')
const orderPage = require('./router/order')
const usersPage = require('./router/users')
const adminPage = require('./router/admin')
const authPage = require('./router/auth')
const varMid = require('./middleware/var')
const api = require('./router/api')

const keys = require('./keys/dev')
// const MONGODB_URI = 'mongodb://127.0.0.1:27017/market'

// const fileMid = require('./middleware/file')

const app = express()

const hbs = exphbs.create({
  defaultLayout: 'main',
  extname: 'hbs'
})
app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', 'views')
app.use(express.urlencoded({
  extended: true
}))
app.use('/image', express.static('image'))
app.use(express.static(__dirname+'/public'))

app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers, X-CSRF-Token');
  // res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

// !
const store = new MongoStore({
  collection: 'session',
  uri: keys.MONGODB_URI
})
app.use(session({
  secret: keys.SESSION_SECRET,
  saveUninitialized: true,
  cookie:{
    maxAge: 1000 * 60 * 60 * 5,
    secure: false,
  },
  resave: false,
  store
}))


// app.use(fileMid.single('img'))
app.use(bodyParser.json())
// app.use(cookieSession())
app.use(csrf()) 
app.use(flash()) 
app.use(varMid)


app.use(routerPage)
app.use('/api', api) // /api
app.use('/category', categoryPage)
app.use('/subcategory', subcategoryPage)
app.use('/atribute', atributePage)
app.use('/product', productPage)
app.use('/order', orderPage)
app.use('/users', usersPage)
app.use('/admin', adminPage)
app.use('/auth', authPage)

const PORT = process.env.PORT || 3000

async function dev() {
  try {
    await mongoose.connect(keys.MONGODB_URI,{useNewUrlParser:true})
    app.listen(PORT,()=>{
        console.log('Server is running')
    })
  } catch (error) {
    console.log(error)
  }
}
dev()