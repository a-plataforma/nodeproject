// users.js
//
// Users schema.
//

// Dependencies
var mongoose = require('mongoose');

// Schema
var passwordResetSchema = new mongoose.Schema(
    {
        code: {
            type: String,
            required: true,
            unique: true
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User'
        },
        expiration_date: {
            type: Date,
            required: true
        }
    }
);

mongoose.model('PasswordReset', passwordResetSchema);