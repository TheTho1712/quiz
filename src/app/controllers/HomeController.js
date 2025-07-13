const { prisma } = require('../../config/db');


class HomeController {
    async index(req, res){
        try {
            const page = Number(req.query.page) || 1;
            const bestPage = Number(req.query.bestPage) || 1;
            const limit = 6;
            const offset = (page - 1) * limit;
            const bestOffset = (bestPage - 1) * limit;

            const genreSlug = req.query.genre || 'all';

            const genreMap = {
                art: 'Art',
                entertainment: 'Entertainment',
                geography: 'Geography',
                history: 'History',
                science: 'Science',
                sports: 'Sports',
                music: 'Music',
            };
            const selectedGenre = genreMap[genreSlug];
            if(genreSlug !== 'all' && selectedGenre){
                const quizList = await prisma.quiz.findMany({
                    where: {
                        deleted: false,
                        genre: selectedGenre,
                    },
                    orderBy: {
                        createdAt: 'desc',
                    }
                });

                return res.render('home', {
                    quizList,
                    genre: genreSlug
                });
            }
            const recentlyPublished = await prisma.quiz.findMany({
                where: { deleted: false },
                orderBy: { createdAt: 'desc' },
                take: limit,
                skip: offset,
            });

            const totalPages = Math.ceil(
                await prisma.quiz.count({ where: { deleted: false } }) / limit
            );

            const rating = await prisma.quiz.findMany({
                where: { deleted: false },
                orderBy: { rating: 'desc' },
                take: limit,
                skip: bestOffset,
            });
            const bestTotalPages = Math.ceil(
                await prisma.quiz.count({ where: { deleted: false } }) / limit
            );

            return res.render('home', {
                recentlyPublished,
                rating,
                currentPage: page,
                bestPage,
                totalPages,
                bestTotalPages,
                genre: genreSlug
            });
        }catch (err) {
            console.error(err);
            res.render('home', { errorMessage: 'Đã xảy ra lỗi.' });
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