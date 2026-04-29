const bcryptjs = require('bcryptjs');
const jsonwebtoken = require('jsonwebtoken');
const Customer = require('../models/Customer');
const nibssService = require('../services/nibssService');
const register = async (req, res) => {
    try {
        const { name, email, password, phone } = req.body;

        const existingCustomer = await Customer.findOne({ email });
        if (existingCustomer) {
            return res.status(400).json({ message: 'Customer already exists' });
        }
        const hashedPassword = await bcryptjs.hash(password, 10);
        const customer = await Customer.create({
            name,
            email,
            password: hashedPassword,
            phone
        });
        res.status(201).json({ message: 'Customer registered successfully', customer });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const existingCustomer = await Customer.findOne({ email });
        if (!existingCustomer) {
            return res.status(400).json({ message: 'Customer not found' });
        }
        const isMatch = await bcryptjs.compare(password, existingCustomer.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const token = jsonwebtoken.sign({ id: existingCustomer._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const verifyBvn = async (req, res) => {
    try {
        const { bvn, dob } = req.body;
        
        const validateBvn = await nibssService.validateBvn(bvn);
        console.log('validateBvn response:', JSON.stringify(validateBvn));
        
        if (!validateBvn) 
            return res.status(400).json({ message: 'BVN not found' });

        const updated = await Customer.findByIdAndUpdate(req.customer._id, {
            isVerified: true,
            bvn: bvn
        }, { new: true });

        console.log('Updated customer:', JSON.stringify(updated));

        res.status(200).json({ message: 'Bvn verified successfully' });
    } catch (error) {
        console.log('verifyBvn error:', error.message);
        res.status(500).json({ message: 'Verification failed', error: error.message });
    }
};

const verifyNin = async (req, res) => {
    try {
        const { firstName, lastName, dob, nin } = req.body;
        await nibssService.insertNin({ firstName, lastName, dob, nin });
        const validateNin = await nibssService.validateNin(nin);
        await Customer.findByIdAndUpdate(req.customer._id, {
            isVerified: true,
            nin: nin
        });
        res.status(200).json({ message: 'Nin is verified', nin });
    } catch (error) {
        res.status(500).json({ message: 'Invalid Credentials', error: error.message });
    }
};


module.exports = {
    register,
    login,
    verifyBvn,
    verifyNin
};