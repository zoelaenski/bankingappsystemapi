const { Schema, model } = require('mongoose');
const customerSchema = new Schema({
    name: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true
    },

    phone: {
        type: String,
        required: true
    },

    bvn: {
        type: String,
        default: null
    },

    nin: { 
        type: String,
        default: null
    },

    isVerified: {
        type: Boolean,
        default: false
    },

    accountCreated: {
        type: Boolean,
        default: false
    },
},
 { timestamps: true });


 const Customer = model('Customer', customerSchema);
 module.exports = Customer;