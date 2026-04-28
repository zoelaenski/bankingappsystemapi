const Account = require('../models/Account');
const Customer = require('../models/Customer');
const Transaction = require('../models/Transaction');
const nibssService = require('../services/nibssService');
const getTransactionHistory = async (req, res) => {
    try {
        const existingAccount = await Account.findOne({ customer: req.customer._id });
        if (!existingAccount) {
            return res.status(404).json({ message: 'Account not found' });
        };

        const transactions = await Transaction.find({ sender: existingAccount._id });
        res.status(200).json({ message: 'Transaction History', transactions });


    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const getTransactionStatus = async (req, res) => {
    try {
        const { ref } = req.params;
        const transaction = await nibssService.getTransaction (ref);
        res.status(200).json({ message: 'Transaction Status', transaction });
    } catch (error) {
res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = {
    getTransactionHistory,
    getTransactionStatus
};