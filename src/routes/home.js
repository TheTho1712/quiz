const express = require('express');
const router = express.Router();

const HomeController = require('../app/controllers/HomeController');

router.get('/detail/:id', HomeController.details);
router.post('/quizzes/:id/submit', HomeController.submitQuiz);
router.get('/quizzes/:id/data', HomeController.getQuizData);
router.get('/quizzes/:id', HomeController.playQuiz);
router.get('/', HomeController.index);

module.exports = router;