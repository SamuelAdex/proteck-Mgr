const {Router} = require('express')
const Faulty = require('../models/Faulty')
const GoogleAdsScript = require('../models/GoogleAdsScript')
const Adsense = require('../models/Adsense')

const router = Router()

/* Index GET Route */
router.get('/', (req, res, next)=>{
    Faulty.find().sort({createdAt:'desc'})
    .then(faulty =>{
        GoogleAdsScript.find()
        .then(google =>{
            Adsense.find()
            .then(adsense =>{
                res.render('index', {faulties: faulty, user: req.user, adsense, google})
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


/* 404 GET Page */
router.get('/404Error', (req, res, next)=>{
    res.render("404", {title: "404 Error | Page"})
})


module.exports = router;