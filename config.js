var format = require('string-format');

var config = {};

config.domain = (process.env.NODE_ENV == 'development' ? 'localhost' : process.env.NODE_ENV);
config.port = normalizePort(process.env.PORT || '3000');

config.databaseURI = 'mongodb://localhost/fluxei';
if (process.env.NODE_ENV === 'production') {
    config.databaseURI = process.env.MONGOLAB_URI;
    config.domain = process.env.DOMAIN;
}

config.secretKey = 'fluxei-2016-uxhumano'; // TODO: onde colocar essa chave secreta?

config.sessionTimeout = 2 * 60 * 60 * 1000; // Session has timespan of 2 hours
config.rememberMeTimeout = 30 * 24 * 60 * 60 * 1000; // Rememeber me for 30 days
config.resetPasswordTimeout = 10 * 1000;//2 * 60 * 60 * 1000; // Password reset link timeout

config.forgotPasswordEmailText =
    'Olá {0},<br/>' +
    '<p>Alguém requisitou uma nova senha para {1}.</p>' +
    '<p>Clique <a href="' + format('http://{0}{1}/auth/reset-password/', config.domain, config.port != 80 ? ':' + config.port : '') + '{2}">aqui</a> para acessar a página para trocar a sua senha.</p>';
config.email = {
    service: 'Gmail',
    address: 'aplataformaproject@gmail.com',
    auth: {
        user: 'aplataformaproject@gmail.com',
        pass: 'Blockchain@APlataforma'
    }
};

config.facebookAuth = {
    clientID: '1179971672051131',
    clientSecret: 'c9cfb9f61b82288d97ebd28c7ca38df0',
    callbackURL: format('http://{0}{1}/auth/facebook/callback', config.domain, config.port != 80 ? ':' + config.port : '')
};

config.googleAuth = {
    clientID: '1094902988024-n2qcs89ngetiifdc6v6ptsdui3tsnn1k.apps.googleusercontent.com',
    clientSecret: 'zycYebonZ6Xmct9m5IbRHv6F',
    callbackURL: format('http://{0}{1}/auth/google/callback', config.domain, config.port != 80 ? ':' + config.port : '')
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