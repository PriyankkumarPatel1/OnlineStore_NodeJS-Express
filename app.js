'use strict';
var debug = require('debug');
var express = require('express');
var session = require('express-session');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcryptjs');

require('dotenv').config();

// usermodel to work with user auth
var userModel = require('./models/user');


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

// mongoose library to work with mongo database
var mongoose = require('mongoose');

// connection url for mongo db
const uri = process.env.DB_URI;

//Connect to mongo database
try {
    mongoose.connect(uri, { useNewUrlParser: true });
    var db = mongoose.connection;
    db.on('error', function (err) {
        console.log(err);
    });
    db.once('open', function (callback) {
        console.log('Connected to MongoDB');
    });
} catch (err) {
    console.log("Error : " + err);
}


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use(session({
  secret: 'secrettexthere',
  saveUninitialized: true,
  resave: true
}));

//init passport authentication
app.use(passport.initialize());
app.use(passport.session());

// user auth
passport.serializeUser(function (user, done) {
  done(null, user.id)
});

passport.deserializeUser(function (id, done) {
  userModel.findById(id, function (err, user) {
      done(err, user);
  });
});

app.use('/', indexRouter);
app.use('/users', usersRouter);

// local stategy to allow for login
passport.use(new LocalStrategy(
  function (username, password, done) {
      userModel.findOne({
          username: username
      }, function (err, user) {
          if (err) {
              return done(err);
          }

          if (!user) {
              return done(null, false);
          }
          //Compare hashed passwords
          if (!bcrypt.compareSync(password, user.password)) {
              return done(null, false);
          }

          return done(null, user);
      });
  }
));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
