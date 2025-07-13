const express = require('express');
const router = express.Router();

const SiteController = require('../app/controllers/SiteController');
const userAuth = require('../app/middlewares/userAuth');

router.post('/quizzes/:id/submit', userAuth, SiteController.submitQuiz);
router.get('/quizzes/:id/data', userAuth, SiteController.getQuizData);
router.get('/quizzes/:id', userAuth, SiteController.playQuiz);

module.exports = router;