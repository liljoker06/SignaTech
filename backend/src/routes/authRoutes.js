const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verifyToken } = require('../middlewares/auth');

// Routes publiques
router.post('/signup', authController.signup);
router.post('/login', authController.login);

// Routes protégées (nécessitent un token)
router.get('/profile', verifyToken, authController.getProfile);

module.exports = router;
