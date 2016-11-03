// usersControllers.js
//
// Controller for user's business.
//

// Dependencies
var passport = require('passport'),
    mongoose = require('mongoose'),
    mailer = require('nodemailer'),
    config = require('../config.js'),
    pjson = require('../package.json'),
    format = require('string-format');

var User = mongoose.model('User');
var PasswordReset = mongoose.model('PasswordReset');
var usersController = {};

// GET Profile
usersController.profileGet = function (req, res) {
    return res.render('profile', {
        user: req.user,
        message: req.flash('message'),
        error: req.flash('error')
    });
};

// GET Forgot password
usersController.forgotPasswordGet = function (req, res) {
    res.render('forgot-password', {
        user: req.user,
        message: req.flash('message'),
        error: req.flash('error')
    });
};

// POST Forgot password
usersController.forgotPasswordPost = function (req, res) {
    req.check('email', 'Precisa informar um e-mail válido.').isEmail();

    var errors = req.validationErrors();
    if (errors) {
        res.render('forgot-password',
            {
                user: req.user,
                error: errors
            }
        );
    }
    else {
        var email = req.body.email;
        User.findOne({'email': email},
            function (err, user) {
                // Error
                if (err) {
                    console.log('erro: ' + err);
                    req.flash('error', [{msg: 'Não foi possível enviar a mensagem.'}]);
                }
                else if (user) { // User was found in database
                    // Creates the password reset token
                    var newPasswordReset = new PasswordReset(); // TODO: não criar outro token quando um válido já existir

                    newPasswordReset.user = user;
                    newPasswordReset.code = user.generateTempUrl();
                    newPasswordReset.expiration_date = new Date() + config.resetPasswordTimeout;

                    newPasswordReset.save().then(
                        function () {
                            // Send the e-mail
                            var transporter = mailer.createTransport({
                                service: config.email.service,
                                auth: config.email.auth
                            });

                            var mailOptions = {
                                from: format('{0} {1}', pjson.description, config.email.address),
                                to: email,
                                subject: 'Redefinir a senha',
                                html: format(config.forgotPasswordEmailText, user.name, pjson.description, newPasswordReset.code)
                            };

                            transporter.sendMail(mailOptions,
                                function (err, info) {
                                    if (err) {
                                        console.log(err);
                                        req.flash('error', [{msg: 'Não foi possível enviar a mensagem.'}]);
                                    } else {
                                        req.flash('message', [{msg: 'Uma mensagem foi enviada para seu e-mail. Verifique sua caixa de entrada.'}]);
                                    }

                                    res.render('forgot-password', {
                                        user: req.user,
                                        message: req.flash('message'),
                                        error: req.flash('error')
                                    });

                                    transporter.close();
                                }
                            );

                            return done(null, newPasswordReset);
                        },
                        function (err) {
                            console.log('erro: ' + err);
                            return done(err);
                        }
                    );

                    return true;
                }
                else { // User not found in database
                    req.flash('error', [{msg: 'E-mail não encontrado.'}]);
                }

                res.render('forgot-password', {
                    user: req.user,
                    message: req.flash('message'),
                    error: req.flash('error')
                });
            }
        );
    }
};

// GET Reset password
usersController.resetPasswordGet = function (req, res) {
    res.render('reset-password', {
        user: req.user,
        message: req.flash('message'),
        code: req.params.code,
        error: req.flash('error')
    });
};

usersController.resetPasswordRedirect = function (req, res) {
    res.render('reset-password', {
        user: req.user,
        code: req.params.code,
        message: req.flash('message'),
        error: req.flash('error')
    });
}

// POST Reset password
usersController.resetPasswordPost = function (req, res, next) {
    req.check('new_password', 'Precisa informar a nova senha.').notEmpty();
    if (req.body.new_password) {
        req.check('password_confirmation', 'A senha deve ser igual a confirmação.').equals(req.body.new_password);
    }

    var errors = req.validationErrors();
    if (errors) {
        req.flash('error', errors);
        next();
    }
    else {
        PasswordReset.findOne(
            { // TODO: links temporários expirados
                code: req.params.code/*,
             expiration_date: {
             $gt: new Date().toISOString()
             }*/
            },
            function (err, passwordReset) {
                // Error
                if (err) {
                    console.log('erro: ' + err);
                    req.flash('error', [{msg: 'Não foi possível redefinir a senha.'}]);
                    next();
                }
                else if (!passwordReset) {
                    req.flash('error', [{msg: 'Seu link expirou. Requisite uma nova senha.'}]);
                    next();
                }
                else {
                    // Find user
                    User.findById(passwordReset.user,
                        function (err, user) {
                            if (err) {
                                console.log('erro: ' + err);
                                req.flash('error', [{msg: 'Não foi possível redefinir a senha.'}]);
                                next();
                            }
                            if (!user) {
                               req.flash('error', [{msg: 'Usuário inválido.'}]);
                                next();
                            }
                            else { // Updates user password
                                user.setPassword(req.body.new_password);

                                user.save().then(
                                    function () {
                                        req.flash('message', [{msg: 'Senha redefinida com sucesso!'}]);
                                        next();
                                    },
                                    function (err) {
                                        console.log('erro: ' + err);
                                        req.flash('error', [{msg: 'Não foi possível redefinir a senha.'}]);
                                        next();
                                    }
                                );
                            }
                        }
                    );
                }

                return true;
            }
        );
    }
};

// GET Register
usersController.registerGet = function (req, res) {
    res.render('register', {
        user: req.user,
        name: req.flash('name'),
        email: req.flash('email'),
        username: req.flash('username'),
        accept_news: req.flash('accept_news'),
        message: req.flash('message'),
        error: req.flash('error')
    });
};

// POST Register
usersController.registerPost = function (req, res) {
    req.check('name', 'Precisa informar o nome.').notEmpty();
    req.check('email', 'Precisa informar um e-mail válido.').isEmail();
    req.check('username', 'Precisa informar o usuário.').notEmpty();
    req.check('password', 'Precisa informar a senha.').notEmpty();
    if (req.body.password) {
        req.check('password_confirmation', 'A senha deve ser igual a confirmação.').equals(req.body.password);
    }

    var errors = req.validationErrors();
    if (errors) {
        res.render('register', {
            user: req.user,
            name: req.body.name,
            email: req.body.email,
            username: req.body.username,
            accept_news: req.body.accept_news,
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
        )(req, res);
    }
};

// GET Login
usersController.loginGet = function (req, res) {
    res.render('login', {
        user: req.user,
        username: req.flash('username'),
        message: req.flash('message'),
        error: req.flash('error')
    });
};

// POST Login
usersController.loginPost = function (req, res) {
    req.check('username', 'Precisa informar o usuário.').notEmpty();
    req.check('password', 'Precisa informar a senha.').notEmpty();

    var errors = req.validationErrors();
    if (errors) {
        res.render('login', {
            user: req.user,
            username: req.body.username,
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
        )(req, res);
    }
};

// GET Facebook Authentication
usersController.authFacebookGet = function (req, res) {
    passport.authenticate('facebook', {scope: 'email'})(req, res);
};

// GET Facebook Authentication Callback
usersController.authFacebookCallbackGet = function (req, res) {
    passport.authenticate('facebook', {
        successRedirect: '/profile',
        failureRedirect: '/auth/login'
    })(req, res);
};

// GET Google Authentication
usersController.authGoogleGet = function (req, res) {
    passport.authenticate('google', {scope: ['profile', 'email']})(req, res);
};

// GET Google Authentication Callback
usersController.authGoogleCallbackGet = function (req, res) {
    passport.authenticate('google', {
        successRedirect: '/profile',
        failureRedirect: '/auth/login'
    })(req, res);
};

// POST Logout
usersController.logoutGet = function (req, res) {
    req.logout();
    res.redirect('/');
};

module.exports = usersController;