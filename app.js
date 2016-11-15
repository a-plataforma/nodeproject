// app.js
//
// This is the backend server startup app.
//

// Dependencies
var express = require('express'),
    handlebars = require('express-handlebars'),
    session = require('express-session'),
    //favicon = require('serve-favicon'), // TODO: quando tiver o favicon
    passport = require('passport'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    logger = require('morgan'),
    path = require('path'),
    flash = require('connect-flash'),
    expressValidator = require('express-validator'),
    MongoStore = require('connect-mongo')(session),
    mongoose = require('mongoose');

// Setup
require('./db.js');
require('./auth/init.js');
var config = require('./config.js'),
    router = require('./routes/index.js')(passport);

// Express framework configurations
var app = express();

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'handlebars');

// Configure express to use handlebars templates
var hbs = handlebars.create({defaultLayout: 'main'});
app.engine('handlebars', hbs.engine);

//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico'))); // TODO: quando tiver o favicon
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(expressValidator());
app.use(express.static(path.join(__dirname, 'public')));

// Configure flash middleware to store messages in session and displaying in templates
app.use(flash());

// Configure auth
app.use(session(
    {
        saveUninitialized: false,
        resave: false,
        secret: config.secretKey,
        rolling: true, // Renew sessions when refresh
        cookie: {
            maxAge: config.sessionTimeout // Session timeout
        },
        store: new MongoStore(
            {
                mongooseConnection: mongoose.connection
            }
        )
    })
);
app.use(passport.initialize());
app.use(passport.session());

// Initialize Passport
var initPassport = require('./auth/init.js');
initPassport(passport);

// Add server routes
app.use(router);

// Handle 404
app.use(function(req, res) {
    res.status(400).render('404');
});

// Catch unauthorised errors
app.use(function (error, req, res, next) {
    if (error.name === 'UnauthorizedError') {
        res.status(401).json({"message": error.name + ": " + error.message});
    }
});

// Handle 500
if (app.get('env') === 'development') {
    app.use(function (error, req, res, next) {
        res.status(error.status || 500).render('500', {message: error.message, error: error});
    });
}

// Handle 500
app.use(function (error, req, res, next) {
    console.error(err);
    res.status(error.status || 500).render('500', {message: error.message, error: {}});
});

module.exports = app;