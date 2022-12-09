const {Router} = require('express');
const User = require('../../models/User')
const GoogleAdsScript = require('../../models/GoogleAdsScript')
const Adsense = require('../../models/Adsense')
const bcrypt = require('bcryptjs')
const passport = require('passport')
const {ensureAuthenticated, ensurePage} = require('../../Config/auth')


let router = Router()

/* Google Adsense Script POST Route */
router.post('/googleAdsenseScript', ensureAuthenticated, ensurePage("admin"), (req, res, next)=>{
    const {googleAdsenseScript} = req.body;
    const GoogleAds = new GoogleAdsScript({
        script: req.body.googleAdsenseScript
    })
    GoogleAds.save()
    .then((google)=>{
        req.flash("success_msg", "Google Script Changed Successfully")
        res.redirect('/user/adsense')
    })
    .catch((err)=>{
        console.log(err)
        res.status(404).send("404, Page Not Found")
    })
})

/* Adsense Script POST Route */
router.post('/adsenseScript', ensureAuthenticated, ensurePage("admin"), (req, res, next)=>{
    const {adsenseScript} = req.body;
    const AdsenseScript = new Adsense({
        ads: req.body.adsenseScript
    })
    AdsenseScript.save()
    .then((adsense)=>{
        req.flash('success_msg', 'Adsense ScriptChanged Successfully')
        res.redirect('/user/adsense')
    })
    .catch((err)=>{
        console.log(err)
        res.status(404).send("404, Page Not Found")
    })
})

/* DELETE Google Script */
router.delete('/deleteGoogleScript/:id', ensureAuthenticated, ensurePage("admin"), (req, res, next)=>{
    GoogleAdsScript.findByIdAndRemove({_id: req.params.id})
    .then((googleAds)=>{
        req.flash('error_msg', 'Google Script Deleted Successfully')
        res.redirect('/user/adsense')
    })
    .catch((err)=>{
        console.log(err)
        res.status(404).send("404, Page Not Found")
    })
})


/* DELETE Adsense Script */
router.delete('/deleteAdsenseScript/:id', ensureAuthenticated, ensurePage("admin"), (req, res, next)=>{
    Adsense.findByIdAndDelete({_id: req.params.id})
    .then((adsense)=>{
        req.flash('error_msg', 'Adsense Script Deleted Successfully')
        res.redirect('/user/adsense')
    })
    .catch((err)=>{
        console.log(err)
        res.status(404).send("404, Page Not Found")
    })
})

module.exports = router;