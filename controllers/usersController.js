// usersControllers.js
//
// Controller for user's business.
//

// Dependencies
var passport = require('passport');
var mongoose = require('mongoose');

var User = mongoose.model('User');
var usersController = {};

// GET Profile
usersController.profileGet = function (request, response) {
    return response.render('profile', {user: request.user, message: request.flash('message')});
};

// GET Forget password
usersController.resetPasswordGet = function (request, response) {
    response.render('reset-password', {user: request.user, message: request.flash('message')});
};

// POST Register
usersController.resetPassword = function (request, response) {
    return response.send('resetPassword'); // TODO: implementar o reset da senha
};

// GET Register
usersController.registerGet = function (request, response) {
    response.render('register', {user: request.user, message: request.flash('message')});
};

// GET Login
usersController.loginGet = function (request, response) {
    response.render('login', {user: request.user, message: request.flash('message')});
};

// POST Logout
usersController.logout = function (request, response) {
    request.logout();
    response.redirect('/');
};

module.exports = usersController;