const {Router} = require('express');
const User = require('../../models/User')
const Faulty = require('../../models/Faulty')
const Project = require('../../models/Project')
const GoogleAdsScript = require('../../models/GoogleAdsScript')
const Adsense = require('../../models/Adsense')
const bcrypt = require('bcryptjs')
const passport = require('passport')
const {ensureAuthenticated, ensurePage} = require('../../Config/auth')


let router = Router();


/* Login Page */
router.get('/login', (req, res, next)=>{
    res.render('login', {errors})
})

/* Dashboard */
router.get('/dashboard', ensureAuthenticated, (req, res, next)=>{
    User.find()
    .sort({createdAt:'desc'})
    .then(users =>{
        Project.find({user: req.user.id}).populate('faulty')
        .sort({createdAt: 'desc'})
        .then(projects =>{
            Faulty.find()
            .then(faulties =>{
                res.render('moderator/dashboard', {errors, users, projects, faulties, user:req.user})
            })
            .catch(error =>{
                console.error(error)
                res.render('404')
            })
        })
        .catch(error =>{
            console.error(error)
            res.render('404')
        })
    })
    .catch(error =>{
        console.error(error)
        res.render('404')
    })
})

/* Users Page */
router.get('/users', ensureAuthenticated, ensurePage('admin'), (req, res, next)=>{
    User.find().sort({createdAt: 'desc'})
    .then(users=>{
        res.render('moderator/users', {errors, user:req.user, users})
    })
    .catch((error)=>{
        console.error(error)
        res.render('404')
    })
})
/* Edit User Profile Page */
/* router.get('/:id', ensureAuthenticated, (req, res, next)=>{
    const id = req.params.id
    User.findOne({_id: id})
    .then((userObj) =>{
        res.render('moderator/edit_profile', {errors, user:req.user, userObj})
    })
    .catch(err =>{
        console.error(`Error Msg:${err}`)
        res.render('404')
    })
    
}) */

/* Projects Page */
/* GET Request For Pagination */
router.get('/projects/:page', ensureAuthenticated, (req, res, next)=>{
    let perPage = 4;
    let page = req.params.page || 1;
    Project.find({user: req.user._id}).populate('faulty')
    .sort({createdAt: 'desc'})
    .skip((perPage * page) - perPage)
    .limit(perPage)
    .then(projects =>{
        Faulty.find().sort({createdAt: 'desc'})
        .then(faulty =>{
            Project.countDocuments()
            .then(projectCount =>{
                res.render('moderator/projects', {errors, user: req.user, projects, faulties: faulty, current: parseInt(page), pages: Math.ceil(projectCount / perPage)})                
            })
            .catch((error)=>{
                console.error(error)
                res.status(404).render("404")
            })
        })
        .catch(err =>{
            console.error(`Error Msg:${err}`)
            res.render('404')
        })
    })
    .catch((error)=>{
        console.error(`Error Msg:${error}`)
        res.status(404).render("404")
    })
})
router.get('/projects', ensureAuthenticated, (req, res, next)=>{
    let perPage = 4;
    let page = req.params.page || 1;
    Project.find({user: req.user._id}).populate('faulty')
    .sort({createdAt: 'desc'})
    .skip((perPage * page) - perPage)
    .limit(perPage)
    .then(projects =>{
        Faulty.find().sort({createdAt: 'desc'})
        .then(faulty =>{
            Project.countDocuments()
            .then(projectCount =>{
                res.render('moderator/projects', {errors, user: req.user, projects, faulties: faulty, current: parseInt(page), pages: Math.ceil(projectCount / perPage)})                
            })
            .catch((error)=>{
                console.error(error)
                res.status(404).render("404")
            })
        })
        .catch(err =>{
            console.error(`Error Msg:${err}`)
            res.render('404')
        })
    })
    .catch((error)=>{
        console.error(`Error Msg:${error}`)
        res.status(404).render("404")
    })
})

/* Faulties Page */
router.get('/faulties', ensureAuthenticated, ensurePage('admin'), (req, res, next)=>{
    Faulty.find().sort({createdAt:'desc'})
    .then(faulty =>{
        res.render('moderator/faulties', {errors, user: req.user, faulties: faulty})
    })
    .catch((error)=>{
        console.error(error)
        res.status(404).render("404")
    })
})


/* Adsense Page */
router.get('/adsense', ensureAuthenticated, ensurePage('admin'), (req, res, next)=>{
    GoogleAdsScript.find()
    .then(google =>{
        Adsense.find()
        .then(adsense =>{
            res.render('moderator/adsense', {errors, user: req.user, adsense, google})
        })
        .catch((error)=>{
            console.error(error)
            res.status(404).render("404")
        })
    })
    .catch((error)=>{
        console.error(error)
        res.status(404).render("404")
    })
})


/* Add User */
let errors = [];
router.post('/addNewUser', ensureAuthenticated, ensurePage('admin'), (req, res, next)=>{
    const {username, email, password, password1} = req.body;
    if(!username || !email || !password || ! password1){
        errors.push({msg: "Field Must Not be empty :)"})
    }
    if(password !== password1){
        errors.push({msg: "Password mismatch, Try Again"})
    }
    if(password.length < 6){
        errors.push({msg: "Password must not be less than 6 characters"})
    }

    if(errors.length > 0){
        res.render('moderator/users', {
            username,
            email,
            password,
            password1,
            errors,
            user: req.user
        })
    }else{
        User.findOne({email: email})
        .then((user)=>{
            if(user){
                errors.push({msg: "User Already Exist, try Another Email"})
                res.render('moderator/users', {
                    username,
                    email,
                    password,
                    password1,
                    errors,
                    user: req.user
                })
            }else{
                const newUser = new User(req.body)
                //Hash Password
                bcrypt.genSalt(10, (err, salt)=> bcrypt.hash(newUser.password, salt, (err, hash)=>{
                    if(err) throw err;
                    //Set password to hashed
                    newUser.password = hash;
                    //Save User
                    newUser.save()
                    .then(user => {
                        req.flash("success_msg", "User Added Successfully :)")
                        res.redirect('/user/users')
                    })
                    .catch(err => console.log(errors));
                }));
            }
        })
        .catch(err =>{
            res.status(404).render('404')
        })
    }
})

/* LOGIN POST REQUEST */
router.post('/login', (req, res, next)=>{
    passport.authenticate('local', {
        successRedirect: '/user/dashboard',
        failureRedirect: '/user/login',
        failureFlash: true
    })(req, res, next);
});
//Logout Handle
router.get('/logout', (req, res)=>{
    req.logout();
    req.flash('success_msg', 'You are Logged out');
    res.redirect('/user/login');
});


/* Update User */
router.put('/updateUser/:id', ensurePage('admin'), ensureAuthenticated, (req, res, next)=>{
    const id = req.params.id;
    User.findByIdAndUpdate({_id: id})
    .then(user =>{
        
        if(req.body.password == ""){
            user.username = req.body.username;
            user.email = req.body.email;
            user.role = req.body.role;
            user.save()
            .then(users =>{
                req.flash('success_msg', 'User Profile Updated Successfully')
                res.redirect('/user/users')
            })
            .catch((error)=>{
                console.error(error)
                res.status(404).send("404, Page Not Found")
            })
        }else{
            bcrypt.hash(req.body.password, 10)
            .then(newPassword =>{
                user.username = req.body.username;
                user.email = req.body.email;
                user.password = newPassword;
                user.role = req.body.role;
                user.save()
                .then(users =>{
                    req.flash('success_msg', 'User Profile Updated Successfully')
                    res.redirect('/user/users')
                })
                .catch((error)=>{
                    console.error(error)
                    res.status(404).send("404, Page Not Found")
                })
            })
            .catch((error)=>{
                console.error(error)
                res.status(404).send("404, Page Not Found")
            })
            
        }
    })
})
/* Edit User ProfilePOST REquest */
router.put('/edit_profile/:id', ensureAuthenticated, ensurePage(['admin', 'user']), (req, res, next)=>{
    const id = req.params.id;
    User.findByIdAndUpdate({_id: id})
    .then(user =>{
        
        if(req.body.password == ""){
            user.username = req.body.username;
            user.email = req.body.email;
            user.save()
            .then(users =>{
                req.flash('success_msg', 'User Profile Updated Successfully')
                res.redirect('/user/dashboard')
            })
            .catch((error)=>{
                console.error(error)
                res.status(404).send("404, Page Not Found")
            })
        }else{
            bcrypt.hash(req.body.password, 10)
            .then(newPassword =>{
                user.username = req.body.username;
                user.email = req.body.email;
                user.password = newPassword;
                user.save()
                .then(users =>{
                    req.flash('success_msg', 'User Profile Updated Successfully')
                    res.redirect('/user/dashboard')
                })
                .catch((error)=>{
                    console.error(error)
                    res.status(404).send("404, Page Not Found")
                })
            })
            .catch((error)=>{
                console.error(error)
                res.status(404).send("404, Page Not Found")
            })
            
        }
    })
})


/* Delete User */
router.delete('/deleteUser/:id', ensureAuthenticated, ensurePage('admin'), (req, res, next)=>{
    const id = req.params.id;
    User.findById({_id: id})
    .then(user =>{
        if(req.user.role !== "admin"){
            req.flash('error_msg', 'Unauthorize Page Access, Please try again late')
            res.redirect('/user/dashboard')
        }else{
            user.delete()
            .then(users =>{
                req.flash('success_msg', 'User Deleted Successfully')
                res.redirect('/user/users')
            })
            .catch((error)=>{
                console.error(error)
                res.status(404).send("404, Page Not Found")
            })
        }
    })
    .catch((error)=>{
        console.error(error)
        res.status(404).send("404, Page Not Found")
    })
})

module.exports = router;