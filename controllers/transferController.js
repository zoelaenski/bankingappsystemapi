const Account = require('../models/Account');
const Transaction = require('../models/Transaction');
const nibssService = require('../services/nibssService');
const transfer = async (req, res) => {
    try {
        const { to, amount, narration } = req.body;
        const existingAccount = await Account.findOne({ customer: req.customer._id });
        if (!existingAccount) {
            return res.status(400).json({ message: 'Sender account not found' });
        };

        const recipient = await nibssService.nameEnquiry(to);
        const from = existingAccount.accountNumber;
        const nibssAccount = await nibssService.transfer({ from, to, amount });
        const transaction = await Transaction.create({
            sender: existingAccount._id,
            receiver: to,
            amount,
            type: existingAccount.accountNumber.startsWith('451') ? 'intra' : 'inter',
            status: 'success',
            reference: nibssAccount.reference,
            narration
        });
        res.status(200).json({ message: 'Transfer successful', transaction });

    } catch (error) { 
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
module.exports = { transfer };