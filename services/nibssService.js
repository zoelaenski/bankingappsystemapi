const axios = require('axios');
const NIBSS_BASE_URL = process.env.NIBSS_BASE_URL;
const NIBSS_API_KEY = process.env.NIBSS_API_KEY;
const NIBSS_API_SECRET = process.env.NIBSS_API_SECRET;
const getToken = async () => {
    try {
        const response = await axios.post(`${NIBSS_BASE_URL}/api/auth/token`, {
            apiKey: NIBSS_API_KEY,
            apiSecret: NIBSS_API_SECRET
        });

        return response.data.token;

    } catch (error) {
        throw new Error('Failed to get NIBSS token: ' + error.message);
    }
};

const insertBvn = async (customerData) => {
    try {
        const response = await axios.post(`${NIBSS_BASE_URL}/api/insertBvn`, customerData);
        return response.data.data;
    } catch (error) {
        throw new Error('Failed to insert Bvn:' + error.message);
    }
};

const validateBvn = async (bvn) => {
    try {
        const response = await axios.post(`${NIBSS_BASE_URL}/api/validateBvn`, { bvn });
        return response.data.data;
    } catch (error) {
        throw new Error('bvn not found', +error.message);
    }
};

const insertNin = async (customerData) => {
    try {
        const response = await axios.post(`${NIBSS_BASE_URL}/api/insertNin`, customerData);
        return response.data.data;
    } catch (error) {
        throw new Error('Failed to insert Nin:' + error.message);
    }
};

const validateNin = async (nin) => {
    try {
        const response = await axios.post(`${NIBSS_BASE_URL}/api/validateNin`, { nin });
        return response.data.data;
    } catch (error) {
        throw new Error('nin not found', +error.message);
    }
};

const createAccount = async (accountData) => {
    try {
        const token = await getToken();
        console.log('Sending to NIBSS:', JSON.stringify(accountData));
        const response = await axios.post(`${NIBSS_BASE_URL}/api/account/create`, accountData, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data.account;
    } catch (error) {
        console.log('NIBSS Error:', error.response?.data);
        throw new Error('Failed to create account: ' + error.message);
    }
};


const nameEnquiry = async (accountNumber) => {
    try {
        const token = await getToken();
        const response = await axios.get(`${NIBSS_BASE_URL}/api/account/name-enquiry/${accountNumber}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        throw new Error('Failed to get account name: ' + error.message);
    }
};

const getBalance = async (accountNumber) => {
    try {
        const token = await getToken();
        const response = await axios.get(`${NIBSS_BASE_URL}/api/account/balance/${accountNumber}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data.data;
    } catch (error) {
        throw new Error('Failed to get account balance: ' + error.message);
    }
};

const transfer = async (transferData) => {
    try {
        const token = await getToken();
        const response = await axios.post(`${NIBSS_BASE_URL}/api/transfer`, transferData, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data.data;
    } catch (error) {
        throw new Error('Failed to make a transfer: ' + error.message);
    }
};

const getTransaction = async (ref) => {
    try {
        const token = await getToken();
        const response = await axios.get(`${NIBSS_BASE_URL}/api/transaction/${ref}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data.data;
    } catch (error) {
        throw new Error('Failed to get transaction: ' + error.message);
    }
};

module.exports = {
    insertBvn,
    validateBvn,
    insertNin,
    validateNin,
    createAccount,
    nameEnquiry,
    getBalance,
    transfer,
    getTransaction
};