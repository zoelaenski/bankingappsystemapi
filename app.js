const express = require('express');
const app = express();
app.use(express.json());
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to ABI Bank API' });
});

app.use('/api/onboarding', require('./routes/onboardingRoutes'));
app.use('/api/account', require('./routes/accountRoutes'));
app.use('/api/transfer', require('./routes/transferRoutes'));
app.use('/api/transaction', require('./routes/transactionRoutes'));

const path = require('path');
app.use(express.static(path.join(__dirname, 'public')));


module.exports = app;