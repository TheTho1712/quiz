const mongoose = require('mongoose');

const QuizSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    rating: { type: Number, default: 0 },
    image: { type: String },
    questions: [{
        questionText: { type: String, required: true },
        options: [{ type: String, required: true }],
        correctAnswer: { type: String, required: true },
    }],
    duration: { type: Number, default: 0 },
    genre: { type: String },
    difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' },
    deleted: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Quiz', QuizSchema)