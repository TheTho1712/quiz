const bcrypt = require('bcrypt');
const User = require('../models/User');

class ProfileController{

    loginForm(req, res){
        res.render('accounts/login');
    }

    async login(req, res){
        const { email, password } = req.body;
        try {
            const user = await User.findOne({ email });

            if(!user){
                req.session.errorMessage = 'Sai email hoặc mật khẩu';
                return res.redirect('/login');
            }

            const isPasswordValid = await bcrypt.compare(password, user.password);
            
            if(!isPasswordValid){
                req.session.errorMessage = 'Sai email hoặc mật khẩu';
                return res.redirect('/login');
            }

            req.session.user = {
                _id: user._id,
                username: user.username,
                email: user.email,
                avatar: user.avatar,
                role: user.role,
            };

            req.session.successMessage = 'Đăng nhập thành công!';
            res.redirect('/');
        } catch(err){
            console.error(err);
            req.session.errorMessage = 'Có lỗi xảy ra';
            res.redirect('/login');
        }
    }

    registerForm(req, res){
        res.render('accounts/register');
    }

    async register(req, res){
        const { fullname, username, email, password, confirmPassword, gender } = req.body;
        try {

            if(password !== confirmPassword){
                req.session.errorMessage = 'Mật khẩu xác nhận không khớp';
                return res.redirect('/register');
            }

            const existingUser = await User.findOne({ email });
            if(existingUser){
                req.session.errorMessage = 'Email đã tồn tại';
                return res.redirect('/register');
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const user = new User({
                fullname,
                username,
                email,
                password: hashedPassword,
                gender: gender || undefined
            });
            await user.save();

            req.session.successMessage = 'Đăng ký thành công!';
            res.redirect('/login');
        } catch(error){
            console.error(error);
            req.session.errorMessage = 'Đăng ký thất bại. Vui lòng thử lại.';
            res.redirect('/register');
        }
    }

    async logout(req, res){
        try {
            req.session.destroy(err => {
                if (err) {
                    console.error(err);
                    return res.redirect('/');
                }
                res.clearCookie('connect.sid');
                res.redirect('/');
            });
        } catch(err){
            console.error(err);
            res.redirect('/');
        }
    }
}

module.exports = new ProfileController();