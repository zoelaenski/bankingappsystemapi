const Customer = require('../models/Customer');
const Account = require('../models/Account');
const nibssService = require('../services/nibssService');
const createAccount = async (req, res) => {
    try {
        if (!req.customer.isVerified) {
            return res.status(400).json({ message: 'Please verify your BVN or NIN first' });
        };

        const existingAccount = await Account.findOne({ customer: req.customer._id });
        if (existingAccount) {
            return res.status(400).json({ message: 'Customer already has an account' });
        };

        const { kycType, dob } = req.body;
        let kycID;
        if (kycType === 'BVN') {
            kycID = req.customer.bvn
        } else { kycID = req.customer.nin };

        console.log('kycType:', kycType, 'kycID:', kycID, 'dob:', dob);
        const nibssAccount = await nibssService.createAccount({ kycType, kycID, dob });
        const account = await Account.create({
            customer: req.customer._id,
            accountNumber: nibssAccount.accountNumber
        });

        await Customer.findByIdAndUpdate(req.customer._id, {
            accountCreated: true,
        });
        res.status(201).json({ message: 'Account Created Successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};


const getBalance = async (req, res) => {
    try {
        const account = await Account.findOne({ customer: req.customer._id });
        if (!account) {
            return res.status(404).json({ message: 'Account not found' });
        }
        const balance = await nibssService.getBalance(account.accountNumber);
        res.status(200).json({ message: 'Account balance retrieved', balance });

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = {
    createAccount,
    getBalance
};