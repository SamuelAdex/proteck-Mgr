require('dotenv').config();

const mongoose = require('mongoose');
const User = require('../models/User');

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true, 
    useUnifiedTopology: true
}).then(()=> console.log("MONGO CONNECTION OPEN")).catch(err => console.error(`Error: ${err}`))



const seedAdmin = {
    username: "SamuelAdex",
    email: "adexsamuel6@gmail.com",
    password: "Movingforward001",
    role: "admin"    
}

const seedDB = async () => {
    /* await User.deleteMany({}); */
    await User.create(seedAdmin)
}