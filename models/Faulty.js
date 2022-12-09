const mongoose = require("mongoose");
const slugify = require('slugify')


const faultySchema = new mongoose.Schema({
    name:{
        type: String,
        default: 'undefined',
        required: true
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    projects:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project'
    }],
    slug:{
        type: String,
        required: true
    },
    createdAt:{
        type: Date,
        default: Date.now
    }
})

faultySchema.pre('validate', function(next){
    if(this.name){
        this.slug = slugify(this.name, {lower: true, strict: true})
    }
    next();
})


module.exports = mongoose.model('Faulty', faultySchema)