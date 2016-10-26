// db.js
//
// Passport configuration.
//

// Dependencies
var passport = require('passport');
var mongoose = require('mongoose');

var LocalStrategy = require('passport-local').Strategy;
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

    passport.use('login', new LocalStrategy({passReqToCallback: true},
        function (request, username, password, done) {
            User.findOne({username: username}).then(
                function (user) {
                    // User not found in database
                    if (!user) {
                        return done(null, false, request.flash('username', username),
                            request.flash('error', [{msg: 'Usuário ou senha inválidos.'}]));
                    }

                    // Password is invalid
                    if (!user.validPassword(password)) {
                        return done(null, false, request.flash('username', username),
                            request.flash('error', [{msg: 'Usuário ou senha inválidos.'}]));
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
            User.findOne({'username': username}).then(
                function (user) {
                    // User already exists
                    if (user) {
                        return done(null, false, request.flash('message', 'Usuário já existe'));
                    } else { // Create user
                        var newUser = new User();

                        newUser.username = username;
                        newUser.setPassword(password);

                        newUser.email = request.body.email;
                        newUser.name = request.body.name;
                        newUser.accept_news = request.body.accept_news;

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
};
