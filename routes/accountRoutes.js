const express = require('express');
const router = express.Router();
const { createAccount, getBalance, nameEnquiry } = require('../controllers/accountController');
const protect = require('../middleware/auth');

router.get('/name-enquiry/:accountNumber', protect, nameEnquiry);
router.post('/create', protect, createAccount);
router.get('/balance', protect, getBalance);

module.exports = router;
