const mongoose = require("mongoose");

const user_schema = new mongoose.Schema({
    Name: { type: String }, // Correct type for Name
    Email: { type: String }, // Fixed type to String for an email address
    Password: { type: String }, // Correct type for Password
    Payment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PayMent_Schema', // Correctly referencing another schema
        // required: true, // Fixed spelling from 'require' to 'required'
    },
    PhoneNumber: { type: Number, required: true }, // Corrected `Type` to `type` and `require` to `required`
    Valid:{type:Boolean},
    SubUser_Id:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"SubUser_schema"
    }],
    startDate:{type:Data},
    endDate:{type:Date}
    
});

const Netflic_User_data = mongoose.model('Netflic_User_data', user_schema);
module.exports = Netflic_User_data;
