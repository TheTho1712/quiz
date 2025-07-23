const express = require('express');
const router = express.Router();
const upload = require('../app/middlewares/uploads');
const resize = require('../app/middlewares/resizeImage');

const QuizController = require('../app/controllers/QuizController');

router.post('/:id/save', QuizController.saveQuiz);
router.post('/:id/unsave', QuizController.unsaveQuiz);
router.get('/deleted-list', QuizController.deletedList);
router.post('/restore/:id', QuizController.restore);
router.post('/force-delete/:id', QuizController.forceDelete);
router.post('/delete/:id', QuizController.delete);
router.post('/update/:id', upload.single('image'), resize, QuizController.update);
router.get('/edit/:id', QuizController.edit);
router.get('/list', QuizController.list);
router.post('/store', upload.single('image'), resize, QuizController.store);
router.get('/create', QuizController.create);
router.get('/', QuizController.create);



module.exports = router;