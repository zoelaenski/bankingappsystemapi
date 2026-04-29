const express = require('express');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/onboarding', require('./routes/onboardingRoutes'));
app.use('/api/account', require('./routes/accountRoutes'));
app.use('/api/transfer', require('./routes/transferRoutes'));
app.use('/api/transaction', require('./routes/transactionRoutes'));

module.exports = app;