// db.js
//
// Database configuration.
//

// Dependencies
var mongoose = require('mongoose');
var config = require('./config.js');

// Connection to MongoDB
mongoose.connect(config.databaseURI);

// -----------------
// Connection events
// -----------------
mongoose.connection.on('connected', function () {
    console.log('[Mongoose] Contectado a "' + config.databaseURI + '"');
});

mongoose.connection.on('error', function (err) {
    console.log('[Mongoose] Erro: ' + err);
});

mongoose.connection.on('disconnected', function () {
    console.log('[Mongoose] Descontectado');
});

// ----------------------------------------
// Capture app termination / restart events
// ----------------------------------------

// To be called when process is restarted or terminated.
var gracefulShutdown = function (msg, callback) {
    mongoose.connection.close(
        function () {
            console.log('[Mongoose] Desconectado por ' + msg);
            callback();
        }
    );
};

// For nodemon restarts.
process.once('SIGUSR2', function () {
    gracefulShutdown('nodemon restart',
        function () {
            process.kill(process.pid, 'SIGUSR2');
        }
    );
});

// For app termination.
process.on('SIGINT', function () {
    gracefulShutdown('SIGINT',
        function () {
            process.exit(0);
        }
    );
});

// ------------------------------
// Definition of database schemas
// ------------------------------
require('./models/users.js');