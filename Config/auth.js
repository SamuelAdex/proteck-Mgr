module.exports = {
    ensureAuthenticated: function(req, res, next){
        if(req.isAuthenticated()){
            return next();
        }else{
            req.flash('error_msg', 'Please log in to view this resource');
            res.redirect('/user/login')
        }
    },
    ensurePage: (permission)=>{
        return (req, res, next)=>{
            if(req.isAuthenticated()){
                const userRole = req.user.role;
                if(permission.includes(userRole)){
                    next()
                }else{
                    req.flash('error_msg', 'Unauthorized Page Access, Please try again later');
                    res.redirect('/user/dashboard')
                }
            }else{
                req.flash('error_msg', 'Please log in to view this resource');
                res.redirect('/user/login')
            }
        }
    }
}