const { Schema, model } = require('mongoose');
const accountSchema = new Schema({
customer: {
    type: Schema.Types.ObjectId,
    ref: 'Customer',
    required: true
},

accountNumber: {
    type: String,
    required: true,
    unique: true
},

balance: {
    type: Number,
    default: 15000
},
}, {timestamps: true});

const Account = model('Account', accountSchema);
 module.exports = Account;