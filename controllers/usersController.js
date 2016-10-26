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
    return response.render('profile', {
        user: request.user,
        message: request.flash('message'),
        error: request.flash('error')
    });
};

// GET Forget password
usersController.resetPasswordGet = function (request, response) {
    response.render('reset-password', {
        user: request.user,
        message: request.flash('message'),
        error: request.flash('error')
    });
};

// POST Register
usersController.resetPassword = function (request, response) {
    return response.send('resetPassword'); // TODO: implementar o reset da senha
};

// GET Register
usersController.registerGet = function (request, response) {
    response.render('register', {
        user: request.user,
        message: request.flash('message'),
        error: request.flash('error')
    });
};

// GET Login
usersController.loginGet = function (request, response) {
    response.render('login', {
        user: request.user,
        username: request.flash('username'),
        message: request.flash('message'),
        error: request.flash('error')
    });
};

// POST Login
usersController.loginPost = function (request, response) {
    request.check('username', 'Precisa informar o usuário.').notEmpty();
    request.check('password', 'Precisa informar a senha.').notEmpty();

    var errors = request.validationErrors();
    if (errors) {
        response.render('login', {
            user: request.user,
            username: request.body.username,
            error: errors
        });
    }
    else {
        passport.authenticate('login',
            {
                successRedirect: '/profile',
                failureRedirect: '/login',
                failureFlash: true
            }
        )(request, response);
    }
};

// POST Logout
usersController.logout = function (request, response) {
    request.logout();
    response.redirect('/');
};

module.exports = usersController;