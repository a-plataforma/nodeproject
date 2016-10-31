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
        name: request.flash('name'),
        email: request.flash('email'),
        username: request.flash('username'),
        accept_news: request.flash('accept_news'),
        message: request.flash('message'),
        error: request.flash('error')
    });
};

// POST Register
usersController.registerPost = function (request, response) {
    request.check('name', 'Precisa informar o nome.').notEmpty();
    request.check('email', 'Precisa informar um e-mail válido.').isEmail();
    request.check('username', 'Precisa informar o usuário.').notEmpty();
    request.check('password', 'Precisa informar a senha.').notEmpty();
    if (request.body.password) {
        request.check('password-confirmation', 'A senha deve ser igual a confirmação.').equals(request.body.password);
    }

    var errors = request.validationErrors();
    if (errors) {
        response.render('register', {
            user: request.user,
            name: request.body.name,
            email: request.body.email,
            username: request.body.username,
            accept_news: request.body.accept_news,
            error: errors
        });
    }
    else {
        passport.authenticate('register',
            {
                successRedirect: '/profile',
                failureRedirect: '/auth/register',
                failureFlash: true
            }
        )(request, response);
    }
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
                failureRedirect: '/auth/login',
                failureFlash: true
            }
        )(request, response);
    }
};

// GET Facebook Authentication
usersController.authFacebookGet = function (request, response) {
    passport.authenticate('facebook', {scope: 'email'})(request, response);
};

// GET Facebook Authentication Callback
usersController.authFacebookCallbackGet = function (request, response) {
    passport.authenticate('facebook', {
        successRedirect : '/profile',
        failureRedirect : '/auth/login'
    })(request, response);
};

// POST Logout
usersController.logoutGet = function (request, response) {
    request.logout();
    response.redirect('/');
};

module.exports = usersController;