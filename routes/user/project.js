const {Router} = require('express')
const User = require('../../models/User')
const Faulty = require('../../models/Faulty')
const Project = require('../../models/Project')
const GoogleAdsScript = require('../../models/GoogleAdsScript')
const Adsense = require('../../models/Adsense')
const {ensureAuthenticated, ensurePage} = require('../../Config/auth')


const router = Router()

/* Project GET Route */
//Pagination Route
router.get('/projects/:page', (req, res, next)=>{
    let searchOption = req.query.search
    let regexp = new RegExp(searchOption, 'i')

    let perPage = 4;
    let page = req.params.page || 1;
    Project.find({topic: regexp})
    .populate('faulty')
    .sort({createdAt: 'desc'})
    .skip((perPage * page) - perPage)
    .limit(perPage)
    .then(projects =>{        
        Faulty.find().populate('projects')
        .sort({createdAt: 'desc'})        
        .then(faulty =>{    
            GoogleAdsScript.find()
            .then(google =>{
                Adsense.find()
                .then(adsense =>{                    
                    Project.countDocuments()
                    .then(projectCount =>{
                        res.render('project/project', {user: req.user, projects, faulties: faulty, google, adsense, current: parseInt(page), pages: Math.ceil(projectCount / perPage)})
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
            .catch((error)=>{
                console.error(error)
                res.status(404).render("404")
            })                
        })
        .catch(err =>{
            console.log(err)
            res.status(404).render("404")
        })
    })
    .catch(err =>{
        console.log(err)
        res.status(404).render("404")
    })
})
router.get('/projects', (req, res, next)=>{    
    let searchOption = req.query.search
    let regexp = new RegExp(searchOption, 'i')

    let perPage = 4;
    let page = req.params.page || 1;
    Project.find({topic: regexp})
    .populate('faulty')
    .sort({createdAt: 'desc'})
    .skip((perPage * page) - perPage)
    .limit(perPage)
    .then(projects =>{        
        Faulty.find().populate('projects')
        .sort({createdAt: 'desc'})        
        .then(faulty =>{    
            GoogleAdsScript.find()
            .then(google =>{
                Adsense.find()
                .then(adsense =>{                    
                    Project.countDocuments()
                    .then(projectCount =>{
                        res.render('project/project', {user: req.user, projects, faulties: faulty, google, adsense, current: parseInt(page), pages: Math.ceil(projectCount / perPage)})
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
            .catch((error)=>{
                console.error(error)
                res.status(404).render("404")
            })                
        })
        .catch(err =>{
            console.log(err)
            res.status(404).render("404")
        })
    })
    .catch(err =>{
        console.log(err)
        res.status(404).render("404")
    })
})


/* Single_Project GET Route */
router.get('/single_project/:slug', (req, res, next)=>{
    const slug = req.params.slug;
    Project.findOne({slug: slug}).populate('faulty')
    .then(project =>{
        Faulty.find().populate('projects')
        .sort({createdAt: 'desc'})
        .then(faulty =>{
            GoogleAdsScript.find()
            .then(google =>{
                Adsense.find()
                .then(adsense =>{
                    Project.findOne({slug: slug}).populate('user')
                    .then(author =>{
                        res.render('project/single_project', {user: req.user, project, faulties: faulty, google, adsense, author})
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
            .catch((error)=>{
                console.error(error)
                res.status(404).render("404")
            })         
        })
        .catch(err =>{
            console.log(err)
            res.status(404).render("404")
        })
    })
    .catch(err =>{
        console.log(err)
        res.status(404).render("404")
    })
})


/* All Projects Pagination Routes */
router.get('/allprojects/:page', ensureAuthenticated, ensurePage('admin'), (req, res, next)=>{
    let perPage = 4;
    let page = req.params.page || 1;
    Project.find().populate('faulty')
    .sort({createdAt: 'desc'})
    .skip((perPage * page) - perPage)
    .limit(perPage)
    .then(projects =>{
        Faulty.find().sort({createdAt: 'desc'})
        .then(faulty =>{
            Project.countDocuments()
            .then(projectCount =>{
                res.render('moderator/all_projects', {errors, user:req.user, projects, faulties: faulty, current: parseInt(page), pages: Math.ceil(projectCount / perPage)})
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

/* GET Page all project list */
router.get('/allprojects', ensureAuthenticated, ensurePage('admin'), (req, res, next)=>{
    let perPage = 4;
    let page = req.params.page || 1;
    Project.find().populate('faulty')
    .sort({createdAt: 'desc'})
    .skip((perPage * page) - perPage)
    .limit(perPage)
    .then(projects =>{
        Faulty.find().sort({createdAt: 'desc'})
        .then(faulty =>{
            Project.countDocuments()
            .then(projectCount =>{
                res.render('moderator/all_projects', {errors, user:req.user, projects, faulties: faulty, current: parseInt(page), pages: Math.ceil(projectCount / perPage)})
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

/* Edit Project GET Route */
router.get('/edit_project/:id', ensureAuthenticated, ensurePage(['admin', 'user']), (req, res, next)=>{
    const id = req.params.id;
    Project.findOne({_id: id}).populate('faulty')
    .then(project =>{
        Faulty.find().sort({createdAt: 'desc'})
        .then(faulty =>{
            res.render('moderator/edit_project', {user: req.user, errors, project, faulties: faulty})
        })
        .catch(err =>{
            console.log(err)
            res.status(404).render("404")
        })
    })
    .catch(err =>{
        console.log(err)
        res.status(404).render("404")
    })
})

/* Add Project */
let errors = [];
router.post('/addProject', ensureAuthenticated, (req, res, next)=>{
    const {topic, body, faulty} = req.body;
    if(!faulty || !topic || !body){
        errors.push({msg: "⚠️ Fields Can't be empty"})
    }

    if(errors.length > 0){
        res.render('moderator/projects',{
            errors,
            topic,
            faulty,
            body,
            user: req.user
        })
    }else{
        Faulty.findOne({_id: req.body.faulty})
        .then(faulty =>{
            const user = req.user.id;
            const newProject = new Project({
                user,
                topic,
                faulty,
                body
            })
            faulty.projects.push(newProject)
            faulty.save()
            .then(fault =>{
                newProject.save()
                .then(project =>{
                    req.flash('success_msg', '✅ Project Created Successfully')
                    res.redirect('/user/projects')
                })
                .catch(err =>{
                    console.log(err)
                    res.status(404).render("404")
                })
            })
            .catch(err =>{
                console.log(err)
                res.status(404).render("404")
            })                   
        })
        .catch(err =>{
            console.log(err)
            res.status(404).render("404")
        })
    }
})

/* Update Project */
router.put('/updateProject/:id', ensureAuthenticated, (req, res, next)=>{
    const id = req.params.id;
    Project.findByIdAndUpdate({_id: id})
    .then(project =>{
        project.topic = req.body.topic
        project.faulty = req.body.faulty
        project.body = req.body.body
        project.save()
        .then(proj =>{
            req.flash('success_msg', 'Project Updated Successfully')
            res.redirect('/user/projects')
        })
        .catch(err =>{
            console.log(err)
            res.status(404).render("404")
        })
    })
    .catch(err =>{
        console.log(err)
        res.status(404).render("404")
    })
})

/* DElete Project */
router.delete('/deleteProject/:id', ensureAuthenticated, (req, res, next)=>{
    const id = req.params.id;
    Project.findByIdAndRemove({_id: id})
    .then(project =>{
        req.flash('error_msg', "Project Deleted Successfully")
        res.redirect('/user/projects')
    })
    .catch(err =>{
        console.log(err)
        res.status(404).render("404")
    })
})

module.exports = router;