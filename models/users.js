// users.js
//
// Users schema.
//

// Dependencies
var mongoose = require('mongoose');
var crypto = require('crypto');

// Schema
var userSchema = new mongoose.Schema(
    {
        name: String,
        email: String,
        local: {
            username: String,
            hash: String,
            salt: String
        },
        facebook: {
            id: String,
            token: String
        },
        google: {
            id: String,
            token: String
        }
    }
);

// ----------------------
// Methods of user schema
// ----------------------

// Set password
userSchema.methods.setPassword = function (password) {
    this.local.salt = crypto.randomBytes(16).toString('hex');
    this.local.hash = crypto.pbkdf2Sync(password, this.local.salt, 1000, 64).toString('hex');
};

// Validate password
userSchema.methods.validPassword = function (password) {
    var hash = crypto.pbkdf2Sync(password, this.local.salt, 1000, 64).toString('hex');
    return (this.local.hash === hash);
};

mongoose.model('User', userSchema);