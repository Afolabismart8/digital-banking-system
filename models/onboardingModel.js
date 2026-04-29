const mongoose = require ("mongoose");

//onboardFintech
const onboardSchema = new mongoose.Schema({
    name: { type:String, required:true },
    email: { type:String, required:true ,
     match:[ /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
            'Please use a valid email address'] 
     },

// NIBSS credentials from API
    apiKey: { type:String },
    apiSecret: { type:String },
    bankCode: { type:String },
    bankName: { type:String },
    nibssOnboarded: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
})

//create Model
const onboard = mongoose.model("onboard", onboardSchema);

//Login fintech
const loginSchema = new mongoose.Schema({
    apiKey: {type:String, required:true},
    apiSecret:{type:String, required:true},
    fintechId: { type: mongoose.Schema.Types.ObjectId, ref: 'onboard' }
});

//create model
const login = mongoose.model("login", loginSchema);

//Export Models
module.exports = {onboard, login};