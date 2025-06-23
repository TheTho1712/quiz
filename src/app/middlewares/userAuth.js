function userAuth(req, res, next){
    if(!req.session.user){
        req.session.errorMessage = 'Bạn cần đăng nhập để tiếp tục';
        return res.redirect('/login');
    }
    next();
}

module.exports = userAuth;