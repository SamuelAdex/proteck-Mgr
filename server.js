require("dotenv").config()

const express = require("express")
const mongoose = require("mongoose")
const morgan = require("morgan")
const methodOverride = require('method-override')
const flash = require('connect-flash')
const session = require('express-session')
const passport = require('passport')


let app = express()


//Passport config
require('./Config/passport')(passport);

/*  || 'mongodb://localhost/projects' */
/* Mongoose Connection */
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true, 
    useUnifiedTopology: true
}).then(()=> console.log("DB Connected")).catch(err => console.error(`Error: ${err}`))

app.set("view engine", "ejs")
app.use(express.static("public"))
app.use(express.json())

app.use(express.urlencoded({ extended: true}))
app.use(morgan("dev"))
app.use(methodOverride("_method"))
//Express Session
app.use(session({
    secret: "78587437994cnnnsdjdi",
    resave: true,
    saveUninitialized: true
}));


//Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

//Connect Flash
app.use(flash())
//Global Variable
app.use((req, res, next)=>{
    res.locals.success_msg = req.flash('success_msg')
    res.locals.error_msg = req.flash('error_msg')
    res.locals.error = req.flash('error')
    next()
});


/* All Routes Stays Here */
/* Index Router */
const indexRouter = require("./routes/index")
app.use('/', indexRouter)

/* Project Router */
const projectRouter = require("./routes/user/project")
app.use('/project', projectRouter)

/* Faulty Router */
const faultyRouter = require("./routes/user/faulty")
app.use('/faulty', faultyRouter)

/* Adsense Router */
const adsenseRouter = require('./routes/user/adsense')
app.use('/adsense', adsenseRouter)

/* User Router */
const userRouter = require("./routes/user/user")
app.use('/user', userRouter)






/* Server */
const PORT = process.env.PORT || 4009
app.listen(PORT, ()=>{
    console.log(`Running on PORT:${PORT}`)
})