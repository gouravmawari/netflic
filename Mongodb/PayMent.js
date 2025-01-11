const mongoose = require("mongoose");

const Payment_schema = new mongoose.Schema({
    Cardholder_Name: { type: String, required: true }, // Corrected `type` and `required`
    Card_number: { type: Number, required: true },    // Fixed `Type` to `type`
    Expiry_date: { type: Date, required: true },      // Fixed `Type` to `type`
    CVV: { type: Number, required: true },           // Fixed `Type` to `type`
    UserId: {
        type: mongoose.Schema.Types.ObjectId,        // Referencing another schema
        ref: 'Netflic_User_data',
    }
});

const Payment = mongoose.model('PayMent_Schema', Payment_schema);
module.exports = Payment;
