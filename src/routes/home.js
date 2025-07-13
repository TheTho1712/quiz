const express = require('express');
const router = express.Router();

const HomeController = require('../app/controllers/HomeController');

router.get('/detail/:id', HomeController.details);
router.get('/', HomeController.index);

module.exports = router;