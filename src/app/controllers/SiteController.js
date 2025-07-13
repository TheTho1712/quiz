const { prisma } = require('../../config/db');
const levelService = require('../services/levelService');

class SiteController {
    async playQuiz(req, res){
        try {
            const quiz = await prisma.quiz.findUnique({
                where: { id: Number(req.params.id) },
                include: { questions: true }
            });
            if(!quiz){
                return res.status(404).render('error', { errorMessage: 'Quiz không tồn tại' });
            }
            
            res.render('quiz', { 
                // quiz: mongooseToObject(quiz),
                quiz,
                quizId: req.params.id
            });
        } catch(err){
            res.render('quiz', { errorMessage: 'Đã xảy ra lỗi khi lấy quiz.' });
        }
    }

    async getQuizData(req, res){
        try {
            const quiz = await prisma.quiz.findUnique({
                where: { id: Number(req.params.id) },
                include: { questions: true }
            });
            if(!quiz){
                return res.status(404).json({ errorMessage: 'Quiz không tồn tại' });
            }
            
            // res.json(mongooseToObject(quiz));
            res.json(quiz);
        } catch(err){
            res.status(500).json({ errorMessage: 'Đã xảy ra lỗi khi lấy dữ liệu quiz.' });
        }
    }

    async submitQuiz(req, res){
        try {
            const correctCount = Number(req.body.correctCount) || 0;
            const totalQuestions = Number(req.body.totalQuestions) || 0;
            const userId = req.session.user.id;
            const quiz = await prisma.quiz.findUnique({
                where: { id: Number(req.params.id) }
            });
            if(!quiz){
                return res.status(404).render('error', { errorMessage: 'Quiz không tồn tại' });
            }
            await prisma.quizHistory.create({
                data: {
                    // user: req.session.user.id,
                    // quiz: quiz.id,
                    user: { connect: { id: Number(req.session.user.id) } },
                    quiz: { connect: { id: quiz.id } },
                    correctCount,
                    totalQuestions,
                }
            });

            await levelService.addXP(userId, correctCount);

            res.render('quiz-result', { 
                correctCount: correctCount,
                totalQuestions: totalQuestions,
                xpEarned: correctCount * 10,
            });
        } catch(err){
            console.error("Lỗi khi lưu quiz history:", err);
            res.render('quiz-result', { errorMessage: 'Đã xảy ra lỗi khi nộp quiz.' });
        }
    }
}

module.exports = new SiteController();