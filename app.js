// app.js
//
// This is the backend server startup app.
//

// Dependencies
var express = require('express'),
    expressHandlebars = require('express-handlebars'),
    expressSession = require('express-session'),
    //favicon = require('serve-favicon'), // TODO: quando tiver o favicon
    passport = require('passport'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    logger = require('morgan'),
    path = require('path'),
    flash = require('connect-flash'),
    expressValidator = require('express-validator');

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
var hbs = expressHandlebars.create({defaultLayout: 'main'});
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
app.use(expressSession({saveUninitialized: true, resave: true, secret: config.secretKey}));
app.use(passport.initialize());
app.use(passport.session());

// Initialize Passport
var initPassport = require('./auth/init.js');
initPassport(passport);

// Add server routes
app.use(router);

// Catch 404 and forward to error handler
app.use(function (request, response, next) {
    var error = new Error('Página Não Encontrada'); // TODO: o que fazer quando der erro 404?
    error.status = 404;
    next(error);
});

// Catch unauthorised errors
app.use(function (error, request, response, next) {
    if (error.name === 'UnauthorizedError') {
        response.status(401).json({"message": error.name + ": " + error.message});
    }
});

// Development error handler: will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (error, request, response, next) {
        response.status(error.status || 500).render('error', {message: error.message, error: error});
    });
}

// Production error handler: no stacktraces leaked to user
app.use(function (error, request, response, next) {
    res.status(error.status || 500).render('error', {message: error.message, error: {}});
});

module.exports = app;