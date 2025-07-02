const bcrypt = require('bcrypt');
const User = require('../models/User');
const QuizHistory = require('../models/QuizHistory');

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
                fullname: user.fullname,
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

    async profile(req, res){
        if(!req.session.user){
            return res.redirect('/login');
        }
        try {
            const user = await User.findById(req.session.user._id);
            const quizHistory = await QuizHistory.find({ user: user._id })
                .populate({
                    path: 'quiz',
                    select: 'name rating author'
                })
                .sort({ completedAt: -1 })

            res.render('accounts/profile', {
                currentUser: user,
                quizHistory
            });
        }catch(err){
            res.redirect('/');
        }
    }

    async updateProfile(req, res){
        if(!req.session.user){
            return res.redirect('/login');
        }
        try{
            const userId = req.session.user._id;
            const { fullname, username, email, gender, oldPassword, newPassword, confirmNewPassword } = req.body;

            const user = await User.findById(userId);
            if(!user){
                req.session.errorMessage = 'Người dùng không tồn tại';
                return res.redirect('/profile');
            }
            if(oldPassword){
                const isMatch = await bcrypt.compare(oldPassword, user.password);
                if(!isMatch){
                    req.session.errorMessage = 'Mật khẩu cũ không đúng';
                    return res.redirect('/profile');
                }
            }
            if(newPassword || confirmNewPassword){
                if(newPassword !== confirmNewPassword){
                    req.session.errorMessage = 'Mật khẩu mới và xác nhận không khớp';
                    return res.redirect('/profile');
                }
                const hashedNewPassword = await bcrypt.hash(newPassword, 10);
                user.password = hashedNewPassword;
            }
            user.fullname = fullname;
            user.username = username;
            user.email = email;
            user.gender = gender;

            await user.save();
            if(newPassword){
            res.cookie('successMessage', 'Mật khẩu đã được cập nhật thành công. Vui lòng đăng nhập lại.', {
                maxAge: 5000,
                path: '/',
            });
            req.session.destroy((err) => {
                if(err){
                    req.session.errorMessage = 'Có lỗi xảy ra khi đăng xuất';
                    return res.redirect('/profile');
                }
                return res.redirect('/login');
            });
            return;
        }
            req.session.successMessage = 'Cập nhật thông tin cá nhân thành công';
            res.redirect('/profile');
        }catch(err){
            console.error(err);
            req.session.errorMessage = 'Có lỗi xảy ra khi cập nhật thông tin cá nhân';
            return res.redirect('/profile');
        }           
    }
}
module.exports = new ProfileController();