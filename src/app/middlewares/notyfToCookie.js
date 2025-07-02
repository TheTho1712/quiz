function notyfToCookie (req, res, next){
    if(req.session.successMessage){
        res.cookie('successMessage', req.session.successMessage, {
            maxAge: 5000,
            path: '/',
        });
        delete req.session.successMessage;
    }
    if(req.session.errorMessage){
        res.cookie('errorMessage', req.session.errorMessage, {
            maxAge: 5000,
            path: '/',
        });
        delete req.session.errorMessage;
    }
    next();
};


module.exports = notyfToCookie;