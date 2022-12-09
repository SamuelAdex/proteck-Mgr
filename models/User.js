const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
    username:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    projects:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        index: true
    }],
    role:{
        type: String,
        default: "user",
        required: true
    },
    createdAt:{
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('User', userSchema);