var express = require('express');
var router = express.Router();
var passport = require('passport');
var userModel = require('../models/user');
var carModel = require('../models/cars');
var bcrypt = require('bcryptjs');
var formidable = require('formidable');

/* GET home page. */
router.get('/', function(req, res, next) {
  // res.render('ad/index', { title: 'Express', user:req.user,  });
  try {
    carModel.find({}, function (err, cars) {
        console.log(err);
        console.log(cars);
        res.render('ad/index', { car: cars, user: req.user, title: 'Car List' });
    });
  }
  catch (err) {
      console.log(err);
  }
});

/* GET home page. */
router.get('/insert', function(req, res, next) {
  res.render('ad/insert', { title: 'Add New Car', user:req.user });
});

router.post('/insert', function (req, res) {
  var car = new carModel(req.body);
  car.save()
    .then(() => {
      res.redirect('/');
    })
    .catch(err => {
      res.status(400).send(err);
    });
});

// get edit page with data
router.get('/edit/:id', function (req, res) {
  carModel.findById(req.params.id, function (err, cars) {
      if (err){
        console.log(err);
      } 
      res.render('ad/edit', { car: cars, user: req.user, title:'Edit page' })
  })
});

// post method to update data with new object
router.post('/edit', function (req, res) {
  carModel.findByIdAndUpdate(req.body.id, { car: req.body.car, average: req.body.average, price: req.body.price, engine: req.body.engine, type: req.body.type }, function (err, model) {
      console.log(err);
      res.redirect('/');
  });
});

/* GET login page. */
router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Login' });
});

/* GET register page. */
router.get('/register', function(req, res, next) {
  res.render('register', { title: 'Register' });
});

router.post('/register', function (req, res) {
  bcrypt.hash(req.body.password, 10, function (err, hash) {
      var registerUser = {
          username: req.body.username,
          password: hash
      }
      userModel.find({ username: registerUser.username }, function (err, user) {
          if (err) console.log(err);
          if (user.length) console.log('Error: user already exist in database');
          const newUser = new userModel(registerUser);
          newUser.save(function (err) {
              console.log('Add new user to database');
              if (err) console.log(err);
              req.login(newUser, function (err) {
                  if (err) console.log(err);
                  return res.redirect('/');
              });
          });
      });
  })
});

// post method for login which logges in the user to session
router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureMessage: 'Invalid Login'
}));

/*Logout*/
router.get('/logout', function (req, res) {
  req.session.destroy(function (err) {
      res.redirect('/');
  });
});

// delete object from database found by id
router.post('/remove/:id', function (req, res) {
  carModel.findByIdAndDelete(req.params.id, function (err, model) {
      if(err){
        console.log(err);
      }
      res.redirect('/');
  });
});


module.exports = router;
