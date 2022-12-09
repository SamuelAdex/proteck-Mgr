const mongoose = require('mongoose')

const adsenseSchema = new mongoose.Schema({
    ads:{
        type: String,
        required: true
    },
    createdAt:{
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Adsense', adsenseSchema);