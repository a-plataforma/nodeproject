var format = require('string-format');

var config = {};

config.databaseURI = 'mongodb://localhost/a-plataforma';
if (process.env.NODE_ENV === 'production') {
    config.databaseURI = process.env.MONGOLAB_URI;
}

config.secretKey = 'a-plataforma-2016-uxhumano'; // TODO: onde colocar essa chave secreta?

config.sessionTimeout = 2 * 60 * 60 * 1000; // Session has timespan of 2 hours
config.rememberMeTimeout = 30 * 24 * 60 * 60 * 1000; // Rememeber me for 30 days

config.port = normalizePort(process.env.PORT || '3000');

config.facebookAuth = {
    clientID: '1179971672051131',
    clientSecret: 'c9cfb9f61b82288d97ebd28c7ca38df0',
    callbackURL: format('http://localhost:{0}/auth/facebook/callback', config.port)
};

config.googleAuth = {
    clientID: '1094902988024-n2qcs89ngetiifdc6v6ptsdui3tsnn1k.apps.googleusercontent.com',
    clientSecret: 'zycYebonZ6Xmct9m5IbRHv6F',
    callbackURL: format('http://localhost:{0}/auth/google/callback', config.port)
};

// Normalize a port into a number, string, or false.
function normalizePort(val) {
    var port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
}

module.exports = config;