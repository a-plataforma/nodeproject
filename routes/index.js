// index.js
//
// Routes configuration.
//

// Dependencies
var express = require('express');
var passport = require('passport');
var config = require('../config.js');

var router = express.Router();

var ctrlHome = require('../controllers/homeController.js');
var ctrlUser = require('../controllers/usersController.js');

var isAuthenticated = function (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/auth/login');
}

var remember = function (req, res, next) {
    req.session.cookie.maxAge = (req.body.remember ? config.rememberMeTimeout : config.sessionTimeout);
    next();
}

module.exports = function (passport) {
    // home
    router.get('/', ctrlHome.home);

    // profile
    router.get('/profile', isAuthenticated, ctrlUser.profileGet);

    // initiative
    router.get('/initiative', isAuthenticated, ctrlInitiative.initiativeGet);
    router.post('/initiative/', isAuthenticated, ctrlInitiative.initiativePost);

    // forgot password
    router.get('/auth/forgot-password', ctrlUser.forgotPasswordGet);
    router.post('/auth/forgot-password', ctrlUser.forgotPasswordPost);

    // reset password
    router.get('/auth/reset-password/:code', ctrlUser.resetPasswordGet);
    router.post('/auth/reset-password/:code', ctrlUser.resetPasswordPost, ctrlUser.resetPasswordRedirect);

    // authentication
    router.get('/auth/login', ctrlUser.loginGet);
    router.post('/auth/login', remember, ctrlUser.loginPost);

    router.get('/auth/register', ctrlUser.registerGet);
    router.post('/auth/register', ctrlUser.registerPost);

    router.get('/auth/facebook', ctrlUser.authFacebookGet);
    router.get('/auth/facebook/callback', ctrlUser.authFacebookCallbackGet);

    router.get('/auth/google', ctrlUser.authGoogleGet);
    router.get('/auth/google/callback', ctrlUser.authGoogleCallbackGet);

    router.get('/auth/logout', ctrlUser.logoutGet);

    return router;
}