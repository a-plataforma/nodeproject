var config = {};

config.databaseURI = 'mongodb://localhost/a-plataforma';
if (process.env.NODE_ENV === 'production') {
    config.databaseURI = process.env.MONGOLAB_URI;
}

config.secretKey = 'a-plataforma-2016-uxhumano'; // TODO: onde colocar essa chave secreta?

module.exports = config;