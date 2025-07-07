const { prisma } = require('../../config/db');


class HomeController {
    async index(req, res){
        try {
            const recentlyPublished = await prisma.quiz.findMany({
                where: { deleted: false },
                orderBy: { createdAt: 'desc' },
                take: 6,
            });
            const rating = await prisma.quiz.findMany({
                where: { deleted: false },
                orderBy: { rating: 'desc' },
                take: 6,
            });
            res.render('home', {
                recentlyPublished,
                rating,
            });
        } catch(err){
            res.render('home', { errorMessage: 'Đã xảy ra lỗi khi lấy danh sách quiz.' });
        }
    }

    async details(req, res){
        try {
            const quiz = await prisma.quiz.findUnique({
                where: { id: Number(req.params.id) },
                include: { questions: true },
            });
            if(!quiz){
                return res.status(404).render('error', { errorMessage: 'Quiz không tồn tại' });
            }
            res.render('crud/detail', { quiz });
        } catch(err){
            res.render('error', { errorMessage: 'Đã xảy ra lỗi khi lấy chi tiết quiz.' });
        }
    }

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

            res.render('quiz-result', { 
                correctCount: correctCount,
                totalQuestions: totalQuestions,
            });
        } catch(err){
            console.error("Lỗi khi lưu quiz history:", err);
            res.render('quiz-result', { errorMessage: 'Đã xảy ra lỗi khi nộp quiz.' });
        }
    }

    async quizHistoryDetails(req, res) {
        try {
            const history = await prisma.quizHistory.findUnique({
                where: { id: Number(req.params.id) },
                include: { quiz: true }
            });
            res.render('quiz-history-detail', {
                quiz: history.quiz.toObject(),
            });
        }catch(err){
            res.render('error', { errorMessage: 'Đã xảy ra lỗi khi lấy chi tiết lịch sử quiz.' });
        }
    }
}

module.exports = new HomeController();