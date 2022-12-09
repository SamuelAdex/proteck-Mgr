const mongoose = require('mongoose')

const GoogleAdsScriptSchema = new mongoose.Schema({
    script:{
        type: String,
        required: true
    },
    createdAt:{
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('GoogleAdsScript', GoogleAdsScriptSchema);