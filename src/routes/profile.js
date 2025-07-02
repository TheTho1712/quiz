const express = require('express');
const router = express.Router();
const ProfileController = require('../app/controllers/ProfileController');

router.post('/update', ProfileController.updateProfile);
router.get('/profile', ProfileController.profile);
router.get('/logout', ProfileController.logout);
router.post('/register', ProfileController.register);
router.get('/register', ProfileController.registerForm);
router.post('/login', ProfileController.login);
router.get('/login', ProfileController.loginForm);

module.exports = router;