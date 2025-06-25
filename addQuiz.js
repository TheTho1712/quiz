const mongoose = require('mongoose');
const Quiz = require('./src/app/models/Quiz');

async function addQuestions() {
    try {
        // Kết nối đến MongoDB
        await mongoose.connect('mongodb://localhost:27017/quizs', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log('Kết nối MongoDB thành công!');

        // Dữ liệu quiz
        const quizData = {
            name: "Kiến Thức Tổng Hợp Nâng Cao",
            description: "Thử thách tư duy của bạn với những câu hỏi khó về lịch sử, địa lý, văn học, tôn giáo và nghệ thuật. Dành cho người chơi yêu thích kiến thức sâu rộng!",
            difficulty: "hard",
            author: "test",
            image: "",
            duration: 7,
            genre: "Languages",
            rating: 3.8,
            deleted: false,
            questions: 
            [
                {
                    "questionText": "Ai là vị vua cuối cùng của triều đại nhà Nguyễn ở Việt Nam?",
                    "options": ["Bảo Đại", "Gia Long", "Minh Mạng", "Tự Đức"],
                    "correctAnswer": "Bảo Đại"
                },
                {
                    "questionText": "Dãy núi dài nhất thế giới là dãy nào?",
                    "options": ["Andes", "Himalaya", "Rocky Mountains", "Alps"],
                    "correctAnswer": "Andes"
                },
                {
                    "questionText": "Tác phẩm 'Chiến tranh và Hòa bình' là của nhà văn nào?",
                    "options": ["Lev Tolstoy", "Fyodor Dostoevsky", "Victor Hugo", "Franz Kafka"],
                    "correctAnswer": "Lev Tolstoy"
                },
                {
                    "questionText": "Thành phố cổ nào từng được gọi là 'Thành Troy' trong thần thoại Hy Lạp?",
                    "options": ["Ilios", "Sparta", "Athens", "Delphi"],
                    "correctAnswer": "Ilios"
                },
                {
                    "questionText": "Tôn giáo nào có khái niệm 'Luân hồi và nghiệp báo' làm trung tâm trong giáo lý?",
                    "options": ["Phật giáo", "Thiên Chúa giáo", "Hồi giáo", "Do Thái giáo"],
                    "correctAnswer": "Phật giáo"
                },
                {
                    "questionText": "Bức tranh 'Đêm đầy sao' là tác phẩm của họa sĩ nào?",
                    "options": ["Vincent van Gogh", "Claude Monet", "Pablo Picasso", "Salvador Dalí"],
                    "correctAnswer": "Vincent van Gogh"
                },
                {
                    "questionText": "Ai là người đầu tiên đạt giải Nobel Văn học?",
                    "options": ["Sully Prudhomme", "Rudyard Kipling", "Thomas Mann", "Rabindranath Tagore"],
                    "correctAnswer": "Sully Prudhomme"
                },
                {
                    "questionText": "Kinh đô Hoa Lư thuộc tỉnh nào ngày nay?",
                    "options": ["Ninh Bình", "Thanh Hóa", "Nam Định", "Hà Nam"],
                    "correctAnswer": "Ninh Bình"
                },
                {
                    "questionText": "Nhạc cụ truyền thống nào sau đây là của người dân tộc Thái ở Việt Nam?",
                    "options": ["Khèn bè", "Đàn nguyệt", "Đàn tranh", "T’rưng"],
                    "correctAnswer": "Khèn bè"
                },
                {
                    "questionText": "Bộ tiểu thuyết nào sau đây được viết bởi Marcel Proust?",
                    "options": [
                    "Đi tìm thời gian đã mất",
                    "Anh em nhà Karamazov",
                    "Thép đã tôi thế đấy",
                    "Ulysses"
                    ],
                    "correctAnswer": "Đi tìm thời gian đã mất"
                }
            ]


        };

        // Thêm quiz vào MongoDB
        const quiz = new Quiz(quizData);
        await quiz.save();

        console.log(`Thêm quiz thành công với _id: ${quiz._id}`);
    } catch (error) {
        console.error('Đã xảy ra lỗi:', error);
    } finally {
        // Đóng kết nối MongoDB
        mongoose.connection.close();
    }
}

addQuestions();