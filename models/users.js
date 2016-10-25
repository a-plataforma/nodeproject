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
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            unique: true,
            required: true
        },
        username: {
            type: String,
            unique: true,
            required: true
        },
        accept_news: Boolean,
        hash: String,
        salt: String
    }
);

// ----------------------
// Methods of user schema
// ----------------------

// Set password
userSchema.methods.setPassword = function (password) {
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
};

// Validate password
userSchema.methods.validPassword = function (password) {
    var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
    return (this.hash === hash);
};

mongoose.model('User', userSchema);