const mongoose = require("mongoose");

const Payment_schema = new mongoose.Schema({
    Cardholder_Name: { type: String, required: true }, 
    Card_number: { type: Number, required: true },    
    Expiry_date: { type: Date, required: true },     
    CVV: { type: Number, required: true },           
    UserId: {
        type: mongoose.Schema.Types.ObjectId,      
        ref: 'Netflic_User_data',
    }
});

const Payment = mongoose.model('PayMent_Schema', Payment_schema);
module.exports = Payment;
