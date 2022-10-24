var express = require('express');
var router = express.Router();
var producthelper = require('../helpers/prodect-helpers')
var userhelpers = require('../helpers/user-helpers')
var loginadmin = require('../helpers/login-admin');
const { response } = require('../app');



// admin login page

router.get("/adminlogin", function (req, res) {
  if (req.session.loggedIn) {
    res.redirect('/admin')
  } else {
    res.render('admin/adminlogin', { admin: true, loginErr: req.session.loginErr })
  }
})
//login form
router.post("/adminlogin", function (req, res) {
  loginadmin.loginadmin(req.body).then(({ status, admin }) => {

    if (status) {
      req.session.loggedIn = true
      req.session.admin = admin
      res.redirect('/admin')
    }

    else {
      req.session.loginErr = true
      res.redirect('/admin/adminlogin')
    }
  })
})



//admin
/* GET users listing. */
router.get('/', function (req, res, next) {
  if (req.session.loggedIn) {
    userhelpers.getAllUsers().then((users) => {
      console.log(users);
      res.render('admin/allusers', { admin: true, users, login: req.session.loggedIn });
    });
  } else {
    res.redirect('admin/adminlogin')
  }


})


//to add users
router.get('/add-users', function (req, res) {
  if (req.session.loggedIn) {
    res.render('admin/add-users', { admin: true })
  } else {
    res.redirect('/admin/adminlogin')
  }
})



router.post('/add-users', function (req, res) {
  if (req.session.loggedIn) {
    userhelpers.addUser(req.body).then((data) => {
      console.log(req.body);
      
    })
  } else {
    res.redirect('/admin/adminlogin')
  }
  
  res.redirect("/admin");

})







router.get('/allproducts', function (req, res, next) {

  producthelper.getAllProducts().then((products) => {
    console.log(products);

    res.render('admin/allproducts', { admin: true, products });
  })

});
router.get('/add-products', function (req, res) {
  res.render('admin/add-products', { admin: true })
})
router.post('/add-product', function (req, res) {
  // console.log(req.body);
  // console.log(req.files.Image);
  producthelper.addproduct(req.body, (id) => {
    let image = req.files.Image
    image.mv('./public/product-image/' + id + '.jpg', (err, done) => {
      if (!err) {
        res.render("admin/add-products", { admin: true })
      }
      else {
        console.log(err);
      }
    })

  })
})
// router.get('/edit-user:_id',function(req,res){
//   let proId=req.query.id
//   res.render('admin/edit-user')
// })
router.get('/delete-user', function (req, res) {
  if (req.session.loggedIn) {
  let proId = req.query
  // console.log(proId);
  userhelpers.deleteUser(proId).then((response) => {
    res.redirect('/admin')
  })
}else{
  res.redirect('/admin/adminlogin')
}

})
router.get('/edit-users/:id', async (req, res) => {
  let users = await userhelpers.getOneUsers(req.params.id)
  console.log(users);
  res.render('admin/edit-users', { users })
})


router.post('/edit/:id', function (req, res) {
  userhelpers.updateuser(req.params.id, req.body).then(() => {
    res.redirect('/admin')
  })
})


//session destroy

router.get("/admin_loggout", function (req, res) {
  req.session.destroy()
  res.redirect('adminlogin')
})
module.exports = router;
