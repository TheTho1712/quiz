const express = require('express');
const router = express.Router();
const userAuth = require('../app/middlewares/userAuth');

const HomeController = require('../app/controllers/HomeController');

router.get('/quiz/history/:id', userAuth, HomeController.quizHistoryDetails);
router.get('/detail/:id', HomeController.details);
router.post('/quizzes/:id/submit', userAuth, HomeController.submitQuiz);
router.get('/quizzes/:id/data', userAuth, HomeController.getQuizData);
router.get('/quizzes/:id', userAuth, HomeController.playQuiz);
router.get('/', HomeController.index);

module.exports = router;