const express = require('express');
const router = express.Router();
const { register, login, verifyBvn, verifyNin } = require('../controllers/onboardingController');
const protect = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.post('/verify-bvn', protect, verifyBvn);
router.post('/verify-nin', protect, verifyNin);

module.exports = router;