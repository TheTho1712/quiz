const Quiz = require('../models/Quiz');
const { mongooseToObject, multipleMongooseToObject } = require('../../util/mongoose');

class HomeController {
    async index(req, res){
        try {
            const quizzes = await Quiz.find({ deleted: false });
            const successMessage = req.session.successMessage;
            delete req.session.successMessage;

            res.render('home', {
                quizzes: multipleMongooseToObject(quizzes),
                successMessage: successMessage,
            });
        } catch(err){
            res.render('home', { errorMessage: 'Đã xảy ra lỗi khi lấy danh sách quiz.' });
        }
    }

    async details(req, res){
        try {
            const quiz = await Quiz.findById(req.params.id);
            if(!quiz){
                return res.status(404).render('error', { errorMessage: 'Quiz không tồn tại' });
            }

            res.render('crud/detail', { quiz: quiz.toObject() });
        } catch(err){
            res.render('error', { errorMessage: 'Đã xảy ra lỗi khi lấy chi tiết quiz.' });
        }
    }

    async show(req, res){
        try {
            const quiz = await Quiz.findById(req.params.id);
            if(!quiz){
                return res.status(404).render('error', { errorMessage: 'Quiz không tồn tại' });
            }
            
            res.render('play', { quiz: mongooseToObject(quiz) });
        } catch(err){
            res.render('error', { errorMessage: 'Đã xảy ra lỗi khi lấy quiz.' });
        }
    }

    async playQuiz(req, res){
        try {
            const quiz = await Quiz.findById(req.params.id);
            if(!quiz){
                return res.status(404).render('error', { errorMessage: 'Quiz không tồn tại' });
            }
            
            res.render('quiz', { 
                quiz: mongooseToObject(quiz),
                quizId: req.params.id
            });
        } catch(err){
            res.render('quiz', { errorMessage: 'Đã xảy ra lỗi khi lấy quiz.' });
        }
    }

    async getQuizData(req, res){
        try {
            const quiz = await Quiz.findById(req.params.id);
            if(!quiz){
                return res.status(404).json({ errorMessage: 'Quiz không tồn tại' });
            }
            
            res.json(mongooseToObject(quiz));
        } catch(err){
            res.status(500).json({ errorMessage: 'Đã xảy ra lỗi khi lấy dữ liệu quiz.' });
        }
    }

    async submitQuiz(req, res){
        try {
            const correctCount = req.body.correctCount || 0;
            const totalQuestions = req.body.totalQuestions || 0;
            
            res.render('quiz-result', { 
                correctCount: correctCount,
                totalQuestions: totalQuestions,
            });
        } catch(err){
            res.render('quiz-result', { errorMessage: 'Đã xảy ra lỗi khi nộp quiz.' });
        }
    }
}

module.exports = new HomeController();