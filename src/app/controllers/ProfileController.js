const bcrypt = require('bcrypt');
const { prisma } = require('../../config/db');
const levelService = require('../services/levelService');

class ProfileController{

    loginForm(req, res){
        res.render('accounts/login');
    }

    async login(req, res){
        const { email, password } = req.body;
        try {
            const user = await prisma.user.findUnique({ where: { email } });

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
                id: user.id,
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
            const existingUser = await prisma.user.findUnique({ where: { email } });
            if(existingUser){
                req.session.errorMessage = 'Email đã tồn tại';
                return res.redirect('/register');
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            await prisma.user.create({
                data: {
                    fullname,
                    username,
                    email,
                    password: hashedPassword,
                    gender: gender || null
                }
            });

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
            const user = await prisma.user.findUnique({
                where: { id: req.session.user.id },
                include: {
                    achievements: {
                        include: { achievement: true }
                    }
                }
            });
            const quizHistory = await prisma.quizHistory.findMany({ 
                where: { userId: user.id },
                include: {
                    quiz: {
                        select: {
                            name: true,
                            rating: true,
                            author: true,
                        },
                    },
                },
                orderBy: { completedAt: 'desc' },
            });

            const { xpMin, xpMax, xpProgress } = levelService.calculateXPProgress(user.xp, user.level);

            const allAchievements = await prisma.achievement.findMany();

            const currentAchievement = allAchievements
                .filter(a => a.levelReq <= user.level)
                .sort((a, b) => b.levelReq - a.levelReq)[0];

            res.render('accounts/profile', {
                currentUser: user,
                quizHistory,
                achievements: user.achievements.map(item => item.achievement),
                xpProgress,
                xpMin,
                xpMax,
                currentAchievement
            });
        }catch(err){
            res.redirect('/');
        }
    }

    async updateProfile(req, res){
        const userId = req.session.user.id;
        const { fullname, username, email, gender, oldPassword, newPassword, confirmNewPassword } = req.body;
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if(!user){
            req.session.errorMessage = 'Người dùng không tồn tại';
            return res.redirect('/profile');
        }

        if(oldPassword){
            const isMatch = await bcrypt.compare(oldPassword, user.password);
            if (!isMatch) {
                req.session.errorMessage = 'Mật khẩu cũ không đúng';
                return res.redirect('/profile');
            }
        }

        let updatedData = {
            fullname,
            username,
            email,
            gender,
        };

        if(newPassword){
            if(newPassword !== confirmNewPassword){
                req.session.errorMessage = 'Mật khẩu mới và xác nhận không khớp';
                return res.redirect('/profile');
            }
            updatedData.password = await bcrypt.hash(newPassword, 10);
        }

        await prisma.user.update({
            where: { id: userId },
            data: updatedData,
        });

        if(newPassword){
            res.cookie('successMessage', 'Mật khẩu đã được cập nhật thành công. Vui lòng đăng nhập lại.', {
                maxAge: 5000,
                path: '/',
            });
            req.session.destroy((err) => {
                if (err) {
                    req.session.errorMessage = 'Có lỗi xảy ra khi đăng xuất';
                    return res.redirect('/profile');
                }
                return res.redirect('/login');
            });
        } else {
            req.session.successMessage = 'Cập nhật thông tin cá nhân thành công';
            res.redirect('/profile');
        }
    }
}
module.exports = new ProfileController();