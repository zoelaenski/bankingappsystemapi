const { Schema, model } = require('mongoose');
const transactionSchema = new Schema({
sender:  {
    type: Schema.Types.ObjectId,
    ref: 'Account',
    required: true
},

receiver: {
    type: Schema.Types.ObjectId,
    ref: 'Account',
    required: true
},

amount: {
    type: Number,
    required: true
},

type: {
    type: String,
    required: true,
    enum: ['intra', 'inter']
},

status: {
    type: String,
    default: 'pending',
    enum: ['pending', 'success', 'failed']
},

reference: {
    type: String,
    required: true,
    unique: true
},

narration: {
    type: String,
    default: null
},
}, {timestamps: true});


const Transaction = model('Transaction', transactionSchema);
module.exports = Transaction;