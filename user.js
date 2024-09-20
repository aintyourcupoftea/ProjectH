const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    countryCode: { type: String, default: '+91' },
    phone: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: function (v) {
                // Check if the number is exactly 10 digits (before adding +91)
                return /^\d{10}$/.test(v);
            },
            message: props => `${props.value} is not a valid 10-digit phone number!`
        }
    },
    name: { type: String },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const User = mongoose.model('User', userSchema, 'users');

module.exports = User;