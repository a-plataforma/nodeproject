// db.js
//
// Passport configuration.
//

// Dependencies
var passport = require('passport');
var mongoose = require('mongoose');
var config = require('../config.js');

var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var GoogleStrategy = require('passport-google-oauth2').Strategy;
var User = mongoose.model('User');

module.exports = function (passport) {
    passport.serializeUser(
        function (user, done) {
            done(null, user._id);
        });

    passport.deserializeUser(
        function (id, done) {
            User.findById(id, function (err, user) {
                done(err, user);
            });
        });

    // =========================================================================
    // LOCAL ===================================================================
    // =========================================================================
    passport.use('login', new LocalStrategy({passReqToCallback: true},
        function (request, username, password, done) {
            User.findOne({'local.username': username}).then(
                function (user) {
                    // User not found in database
                    if (!user) {
                        return done(null, false,
                            request.flash('username', username),
                            request.flash('error', [{msg: 'Usuário ou senha inválidos.'}])
                        );
                    }

                    // Password is invalid
                    if (!user.validPassword(password)) {
                        return done(null, false,
                            request.flash('username', username),
                            request.flash('error', [{msg: 'Usuário ou senha inválidos.'}])
                        );
                    }

                    // If credentials are correct, return the user object
                    return done(null, user);
                },
                function (err) {
                    console.log('erro: ' + err);
                    return done(err);
                }
            );
        }
    ));

    passport.use('register', new LocalStrategy({passReqToCallback: true},
        function (request, username, password, done) {
            User.findOne(
                {
                    $or: [{'name': request.body.name}, {'email': request.body.email}, {'local.username': username}]
                }
            ).then(
                function (user) {
                    // User already exists
                    if (user) {
                        return done(null, false,
                            request.flash('name', request.body.name),
                            request.flash('email', request.body.email),
                            request.flash('username', username),
                            request.flash('error', [{msg: 'Usuário já existe.'}])
                        );
                    } else { // Create user
                        var newUser = new User();

                        newUser.name = request.body.name;
                        newUser.email = request.body.email;

                        newUser.local.username = username;
                        newUser.setPassword(password);

                        newUser.save().then(
                            function () {
                                return done(null, newUser);
                            },
                            function (err) {
                                console.log('erro: ' + err);
                                return done(err);
                            }
                        );
                    }
                },
                function (err) {
                    console.log('erro: ' + err);
                    return done(err);
                }
            );
        })
    );

    // =========================================================================
    // FACEBOOK ================================================================
    // =========================================================================
    passport.use('facebook', new FacebookStrategy(
        {
            clientID: config.facebookAuth.clientID,
            clientSecret: config.facebookAuth.clientSecret,
            callbackURL: config.facebookAuth.callbackURL,
            profileFields: ["id", "email", "first_name", "last_name"],
        },
        function (token, refreshToken, profile, done) {
            process.nextTick(
                function () {
                    User.findOne({'facebook.id': profile.id}).then(
                        function (user) {
                            // User found
                            if (user) {
                                return done(null, user);
                            } else { // Create user
                                var newUser = new User();

                                newUser.name = profile.name.givenName + ' ' + profile.name.familyName;
                                newUser.email = profile.emails[0].value;

                                newUser.facebook.id = profile.id;
                                newUser.facebook.token = token;

                                newUser.save().then(
                                    function () {
                                        return done(null, newUser);
                                    },
                                    function (err) {
                                        console.log('erro: ' + err);
                                        return done(err);
                                    }
                                );
                            }
                        },
                        function (err) {
                            console.log('erro: ' + err);
                            return done(err);
                        }
                    );
                }
            );
        })
    );

    // =========================================================================
    // GOOGLE ==================================================================
    // =========================================================================
    passport.use('google', new GoogleStrategy(
        {
            clientID: config.googleAuth.clientID,
            clientSecret: config.googleAuth.clientSecret,
            callbackURL: config.googleAuth.callbackURL
        },
        function (token, refreshToken, profile, done) {
            process.nextTick(
                function () {
                    User.findOne({'google.id': profile.id}).then(
                        function (user) {
                            // User found
                            if (user) {
                                return done(null, user);
                            } else { // Create user
                                var newUser = new User();

                                newUser.name = profile.name.givenName + ' ' + profile.name.familyName;
                                newUser.email = profile.emails[0].value;

                                newUser.google.id = profile.id;
                                newUser.google.token = token;

                                newUser.save().then(
                                    function () {
                                        return done(null, newUser);
                                    },
                                    function (err) {
                                        console.log('erro: ' + err);
                                        return done(err);
                                    }
                                );
                            }
                        },
                        function (err) {
                            console.log('erro: ' + err);
                            return done(err);
                        }
                    );
                }
            );
        })
    );
};
