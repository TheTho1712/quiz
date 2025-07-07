const { prisma } = require('../../config/db');

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

            if(req.session.user){
                formData.author = req.session.user.username;
            }

            if(formData.questions){
                formData.questions.forEach(question => {
                    if (question.correctAnswerText) {
                        question.correctAnswer = question.correctAnswerText;
                        delete question.correctAnswerText;
                    }
                });
            }
            await prisma.quiz.create({
                data: {
                    name: formData.name,
                    description: formData.description || null,
                    rating: 0,
                    image: formData.image || null,
                    author: formData.author,
                    duration: parseInt(formData.duration) || 0,
                    genre: formData.genre || null,
                    difficult: formData.difficult || 'medium',
                    questions: {
                        create: formData.questions.map(q => ({
                            questionText: q.questionText,
                            correctAnswer: q.correctAnswer,
                            options: q.options
                        }))
                    }
                }
            });

            req.session.successMessage = 'Quiz đã được tạo thành công!';
            res.redirect('/quiz/list');
        } catch(err){
            res.render('crud/create', {
                errorMessage: 'Đã có lỗi xảy ra khi tạo quiz. Vui lòng thử lại.',
                formData: req.body
            });
        }
    }

    async list(req, res){
        try {
            // const currentUsername = req.session.user.username;
            const quizzes = await prisma.quiz.findMany({
                where: {
                    author: req.session.user.username,
                    deleted: false,
                },
                orderBy: {
                    createdAt: 'desc',
                }
            });
            const successMessage = req.session.successMessage;
            delete req.session.successMessage;
            res.render('list', {
                quizzes: quizzes,
                successMessage: successMessage,
            });
        } catch(err){
            res.render('error', { errorMessage: 'Đã xảy ra lỗi khi lấy danh sách quiz.' });
        }
    }

    async edit(req, res){
        try {
            const quiz = await prisma.quiz.findUnique({
                where: {
                    id: parseInt(req.params.id)
                },
                include: {
                    questions: true
                }
            });
            if (!quiz){
                return res.status(404).render('error', { message: 'Quiz không tồn tại' });
            }
            res.render('crud/edit', { quiz });
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
            await prisma.quiz.update({
            where: { id: parseInt(req.params.id) },
                data: {
                    name: updatedData.name,
                    description: updatedData.description,
                    image: updatedData.image,
                    duration: parseInt(updatedData.duration),
                    genre: updatedData.genre,
                    difficult: updatedData.difficult,
                    questions: {
                        deleteMany: {},
                        create: updatedData.questions.map(q => ({
                            questionText: q.questionText,
                            options: q.options,
                            correctAnswer: q.correctAnswer
                        }))
                    }
                }
            });
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
            await prisma.quiz.update({
                where: { id: parseInt(req.params.id) },
                data: { deleted: true }
            });

            req.session.successMessage = 'Quiz đã được xóa thành công!';
            res.redirect('/quiz/list');
        } catch(err){
            req.session.errorMessage = 'Đã có lỗi xảy ra khi xóa quiz.';
            res.redirect('/quiz/list');
        }
    }

    async forceDelete(req, res){
        try {
            await prisma.quiz.delete({
                where: { id: parseInt(req.params.id) }
            });
            req.session.successMessage = 'Quiz đã được xóa vĩnh viễn!';
            res.redirect('/quiz/list');
        } catch(err){
            req.session.errorMessage = 'Đã có lỗi xảy ra khi xóa vĩnh viễn quiz.';
            res.redirect('/quiz/list');
        }
    }

    async deletedList(req, res){
        try {
            const currentUsername = req.session.user.username;
            // const quizzes = await Quiz.find({ author: currentUsername, deleted: true });
            const quizzes = await prisma.quiz.findMany({
                where: {
                    author: currentUsername,
                    deleted: true,
                },
                orderBy: {
                    createdAt: 'desc',
                }
            })
            res.render('deleted', {
                quizzes,
            });
        } catch(err){
            res.render('error', { errorMessage: 'Đã xảy ra lỗi khi tải danh sách quiz đã xóa.' });
        }
    }

    async restore(req, res){
        try {
            await prisma.quiz.update({
                where: { id: parseInt(req.params.id) },
                data: { deleted: false }
            });
            req.session.successMessage = 'Quiz đã được khôi phục thành công!';
            res.redirect('/quiz/list');
        } catch(err){
            req.session.errorMessage = 'Đã có lỗi xảy ra khi khôi phục quiz.';
            res.redirect('/quiz/deleted');
        }
    }
}

module.exports = new QuizController();