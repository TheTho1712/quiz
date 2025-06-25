const mongoose = require('mongoose');

const quizHistorySchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    quiz: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true },
    correctCount: { type: Number, required: true },
    totalQuestions: { type: Number, required: true },
    completedAt: { type: Date, default: Date.now },
}, {
    timestamps: true
});

module.exports = mongoose.model('QuizHistory', quizHistorySchema);