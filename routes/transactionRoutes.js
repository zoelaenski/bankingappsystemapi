const express = require('express');
const router = express.Router();
const { getTransactionHistory, getTransactionStatus } = require('../controllers/transactionController');
const protect = require('../middleware/auth');

router.get('/history', protect, getTransactionHistory);
router.get('/status/:ref', protect, getTransactionStatus);

module.exports = router;