const {Router} = require('express')
const User = require('../../models/User')
const Faulty = require('../../models/Faulty')
const Project = require('../../models/Project')
const GoogleAdsScript = require('../../models/GoogleAdsScript')
const Adsense = require('../../models/Adsense')
const {ensureAuthenticated, ensurePage} = require('../../Config/auth')


const router = Router()

/* GET Faulty Page */
router.get('/:slug', (req, res, next)=>{
    const slug = req.params.slug;

    Faulty.findOne({slug: slug}).populate('projects')
    .then(faulty =>{
        Project.find().sort({createdAt: 'desc'})
        .then(project =>{
            Faulty.find().sort({createdAt: 'desc'})
            .then(faulties =>{
                GoogleAdsScript.find()
                .then(google =>{
                    Adsense.find()
                    .then(adsense =>{
                        res.render('project/single_faulty', {faulty, faulties, user:req.user, projects: project, google, adsense})
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
            .catch(err=>{
                console.log(err)
                res.status(404).send("404, Page Not Found")
            })
        })
        .catch(err=>{
            console.log(err)
            res.status(404).send("404, Page Not Found")
        })
    })
    .catch(err=>{
        console.log(err)
        res.status(404).send("404, Page Not Found")
    })
})

/* Faulty POST Route */
let errors = [];
router.post('/addFaulty', ensureAuthenticated, ensurePage('admin'), async (req, res, next)=>{
    const {name} = req.body;
    if(name == null){
        errors.push({msg: "Field Must not be empty"})
    }

    if(errors.length > 0){
        res.render('moderator/faulties', {
            name,
            errors,
            user: req.user
        })
    }else{
        const user = req.user.id;
        try {
            const faulty = new Faulty({
                user,
                name
            })
            await faulty.save()
            req.flash('success_msg', `${faulty.name} Faculty Created Successfully`)
            res.redirect('/user/faulties')
        } catch (error) {
            console.error(error)
            res.status(404).send("404, Page Not Found")
        }
    }
})


/* Update Faulty */
router.put('/updateFaulty/:id', ensureAuthenticated, ensurePage('admin'), (req, res, next)=>{
    const id = req.params.id;
    Faulty.findByIdAndUpdate({_id: id})
    .then(faulty =>{
        faulty.name = req.body.name;
        faulty.save()
        .then(fault =>{
            req.flash("success_msg", `${faulty.name} Faculty Updated Successfully`)
            res.redirect('/user/faulties')
        })
        .catch(err=>{
            console.log(err)
            res.status(404).send("404, Page Not Found")
        })
    })
    .catch(err=>{
        console.log(err)
        res.status(404).send("404, Page Not Found")
    })
})


/* Delete Faulty */
router.delete('/deleteFaulty/:id', ensureAuthenticated, ensurePage('admin'), (req, res, next)=>{
    const id = req.params.id;
    Faulty.findByIdAndDelete({_id: id})
    .then(faulty =>{
        req.flash("success_msg", `Faculty Deleted Successfully`)
        res.redirect('/user/faulties')
    })
    .catch(err=>{
        console.log(err)
        res.status(404).send("404, Page Not Found")
    })
})


module.exports = router;