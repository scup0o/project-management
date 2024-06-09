const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username:{
        type: String,
        required: true,
        unique: true,
    },

    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },

    password: {
        type: String,
        required: true,
        minLength: 6,
    },

    phone: {
        type: String,
        required: true,
        minLength:10,
    },

    name: {
        type: String,
    },

    img:{
        type: String,
        default: 'user-img.jpg'
    },

    staffId:{
        type: String,
        required: true,
        unique: true,
    },

    role: {
        type: String,
        enum: ['admin', 'hc', 'kt'],
        default: 'hc',
    },
});

const User = mongoose.model('user', userSchema);

module.exports = User;