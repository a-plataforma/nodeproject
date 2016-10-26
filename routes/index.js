// index.js
//
// Routes configuration.
//

// Dependencies
var express = require('express');
var passport = require('passport');

var router = express.Router();

var ctrlHome = require('../controllers/homeController.js');
var ctrlUser = require('../controllers/usersController.js');

var isAuthenticated = function (req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/login');
}

module.exports = function (passport) {
    // home
    router.get('/', ctrlHome.home);

    // profile
    router.get('/profile', isAuthenticated, ctrlUser.profileGet);

    // forget password
    router.get('/reset-password', ctrlUser.resetPasswordGet);
    router.post('/reset-password', ctrlUser.resetPassword);

    // authentication
    router.get('/login', ctrlUser.loginGet);
    router.post('/login', ctrlUser.loginPost);

    router.get('/register', ctrlUser.registerGet);
    router.post('/register', ctrlUser.registerPost);

    router.get('/logout', ctrlUser.logoutGet);

    return router;
}