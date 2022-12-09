const mongoose = require('mongoose');
const slugify = require('slugify');

const projectSchema = new mongoose.Schema({
    topic:{
        type: String,
        required: true
    },
    body:{
        type: String,
        required: true
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    faulty:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Faulty',
        index: true
    },
    slug:{
        type: String,
        required: true
    },
    createdAt:{
        type: Date,
        default: Date.now
    }
})

projectSchema.pre('validate', function(next){
    if(this.topic){
        this.slug = slugify(this.topic, {lower: true, strict: true})
    }
    next();
})

module.exports = mongoose.model('Project', projectSchema)