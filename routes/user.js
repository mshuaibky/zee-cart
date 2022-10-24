const { response } = require('express');
var express = require('express');
var router = express.Router();
const userSignup = require('../helpers/sign-up');
const userHelpers = require('../helpers/sign-up');
var producthelper = require('../helpers/prodect-helpers')

/* GET home page. */
router.get('/', function (req, res, next) {
  let user = req.session.user
  console.log(user);

  producthelper.getAllProducts().then((products) => {
    console.log(products);
    
    res.render('index', { admin: false, products,user});
  })

  
});

router.get('/login', function (req, res) {
  if (req.session.loggedIn) {
    res.redirect('/')
  }
  else {


    res.render('users/login', { logginErr: req.session.logginErr })
    req.session.logginErr = false
  }
})

router.get('/signup', function (req, res) {
  res.render('users/signup')
})
router.post('/signup', function (req, res) {

  userSignup.doSignup(req.body).then((response) => {

    res.redirect("/login")
  })
})

router.post('/login', function (req, res) {
  userHelpers.doLogin(req.body).then((response) => {
    if (response.status) {
      req.session.loggedIn = true
      req.session.user = response.user
      res.redirect("/")
    } else {

      req.session.logginErr = true
      res.redirect("/login")
    }
  })
})
router.get('/logout', function (req, res) {
  req.session.destroy()
  res.redirect('/login')
})
module.exports = router;
