var config_json = require('./config.json');
var format = require('string-format');

var config = {};
var config_env = (process.env.NODE_ENV == 'production' ? config_json.production : config_json.development);

config.domain = config_env.domain;
config.port = config_env.port;
config.databaseURI = config_env.databaseURI;
config.sessionTimeout = convertToMiliseconds(config_env.timeout.session); // Session time span
config.rememberMeTimeout = convertToMiliseconds(config_env.timeout.rememberMe); // Remember me time span
config.resetPasswordTimeout = convertToMiliseconds(config_env.timeout.resetPassword); // Password reset link time span
config.email = config_env.email;
config.secretKey = config_json.secretKey;

config.forgotPasswordEmailText =
    'Olá {0},<br/>' +
    '<p>Alguém requisitou uma nova senha para {1}.</p>' +
    '<p>Clique <a href="' + format('http://{0}{1}/auth/reset-password/', config.domain, config.port != 80 ? ':' + config.port : '') + '{2}">aqui</a> para acessar a página para trocar a sua senha.</p>';

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

function convertToMiliseconds(time) {
    var miliseconds = 0,
        places = time.split(','),
        number = places[0],
        type = places[1];

    if (type === 'da') {
        miliseconds = number * 24 * 60 * 60 * 1000;
    }
    else if (type === 'hr') {
        miliseconds = number * 60 * 60 * 1000;
    }
    else if (type === 'mn') {
        miliseconds = number * 60 * 1000;
    }
    else if (type === 'sd') {
        miliseconds = number * 1000;
    }

    return miliseconds;
}

module.exports = config;