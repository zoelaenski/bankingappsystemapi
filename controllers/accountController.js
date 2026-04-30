const Customer = require('../models/Customer');
const Account = require('../models/Account');
const nibssService = require('../services/nibssService');
const createAccount = async (req, res) => {
    try {
        if (!req.customer.isVerified) {
            return res.status(400).json({ message: 'Please verify your BVN or NIN first' });
        }

        const existingAccount = await Account.findOne({ customer: req.customer._id });
        if (existingAccount) {
            return res.status(400).json({ message: 'Customer already has an account' });
        }

        const freshCustomer = await Customer.findById(req.customer._id);
        const { dob } = req.body;

        const kycType = freshCustomer.bvn ? 'bvn' : 'nin';
        const kycID = freshCustomer.bvn || freshCustomer.nin;

        console.log('kycType:', kycType, 'kycID:', kycID, 'dob:', dob);

        kycType = kycType.toUpperCase();

        const nibssAccount = await nibssService.createAccount({ kycType, kycID, dob });

        const account = await Account.create({
            customer: req.customer._id,
            accountNumber: nibssAccount.accountNumber
        });

        await Customer.findByIdAndUpdate(req.customer._id, {
            accountCreated: true,
        });

        res.status(201).json({ message: 'Account Created Successfully', accountNumber: account.accountNumber });
    } catch (error) {
        console.log('createAccount error:', error.message);
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

const nameEnquiry = async (req, res) => {
    try {
        const { accountNumber } = req.params;
        const result = await nibssService.nameEnquiry(accountNumber);
        res.status(200).json({ message: 'Account found', data: result });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = {
    createAccount,
    getBalance,
    nameEnquiry
};