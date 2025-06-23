const Quiz = require('../models/Quiz');

class QuizController {
    create(req, res){
        res.render('crud/create');
    }

    async store(req, res){
        try {
            const formData = {...req.body};

            if(req.file){
                formData.image = '/img/' + req.file.filename;
            }

            if(formData.questions){
                formData.questions.forEach(question => {
                    if (question.correctAnswerText) {
                        question.correctAnswer = question.correctAnswerText;
                        delete question.correctAnswerText;
                    }
                });
            }

            const quiz = new Quiz(formData);
            await quiz.save();
            
            req.session.successMessage = 'Quiz đã được tạo thành công!';
            res.redirect('/');
        } catch(err){
            res.render('crud/create', {
                errorMessage: 'Đã có lỗi xảy ra khi tạo quiz. Vui lòng thử lại.',
                formData: req.body
            });
        }
    }

    async list(req, res){
        try {
            const quizzes = await Quiz.find({ deleted: false });
            const successMessage = req.session.successMessage;
            delete req.session.successMessage;
            res.render('list', {
                quizzes: quizzes.map(quiz => quiz.toObject()),
                successMessage: successMessage,
            });
        } catch(err){
            res.render('error', { errorMessage: 'Đã xảy ra lỗi khi lấy danh sách quiz.' });
        }
    }

    async edit(req, res){
        try {
            const quiz = await Quiz.findById(req.params.id);
            if (!quiz){
                return res.status(404).render('error', { message: 'Quiz không tồn tại' });
            }
            res.render('crud/edit', { quiz: quiz.toObject() });
        } catch (err) {
            res.render('error', { errorMessage: 'Đã xảy ra lỗi khi lấy thông tin quiz để chỉnh sửa.', });
        }
    }

    async update(req, res){
        try {
            const quizId = req.params.id;
            const updatedData = { ...req.body };

            if(req.file){
                updatedData.image = '/img/' + req.file.filename;
            }

            if(updatedData.questions){
                updatedData.questions.forEach(question => {
                    if (question.correctAnswerText) {
                        question.correctAnswer = question.correctAnswerText;
                        delete question.correctAnswerText;
                    }
                });
            }

            await Quiz.findByIdAndUpdate(quizId, updatedData, { new: true });
            res.redirect('/quiz/list');
        } catch(err){
            console.error('Lỗi khi cập nhật quiz:', err);
            res.render('crud/edit', {
                errorMessage: 'Đã xảy ra lỗi khi cập nhật quiz',
                quiz: req.body
            });
        }
    }

    async delete(req, res){
        try {
            const quizId = req.params.id;
            await Quiz.findByIdAndUpdate(quizId, { deleted: true });

            req.session.successMessage = 'Quiz đã được xóa thành công!';
            res.redirect('/quiz/list');
        } catch(err){
            req.session.errorMessage = 'Đã có lỗi xảy ra khi xóa quiz.';
            res.redirect('/quiz/list');
        }
    }

    async forceDelete(req, res){
        try {
            const quizId = req.params.id;
            await Quiz.findByIdAndDelete(quizId);
            req.session.successMessage = 'Quiz đã được xóa vĩnh viễn!';
            res.redirect('/quiz/list');
        } catch(err){
            req.session.errorMessage = 'Đã có lỗi xảy ra khi xóa vĩnh viễn quiz.';
            res.redirect('/quiz/list');
        }
    }

    async deletedList(req, res){
        try {
            const quizzes = await Quiz.find({ deleted: true });
            res.render('deleted', {
                quizzes: quizzes.map(quiz => quiz.toObject()),
            });
        } catch(err){
            res.render('error', { errorMessage: 'Đã xảy ra lỗi khi tải danh sách quiz đã xóa.' });
        }
    }

    async restore(req, res){
        try {
            const quizId = req.params.id;
            await Quiz.findByIdAndUpdate(quizId, { deleted: false });
            res.redirect('/quiz/list');
        } catch(err){
            req.session.errorMessage = 'Đã có lỗi xảy ra khi khôi phục quiz.';
            res.redirect('/quiz/deleted');
        }
    }
}

module.exports = new QuizController();