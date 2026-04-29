const mongoose = require("mongoose"); 
const transactionSchema = new mongoose.Schema ({
  from: {type:mongoose.Schema.Types.ObjectId, ref: "Account" },

   to: {type:mongoose.Schema.Types.ObjectId, ref: "Account"},

   amount: {type: String,required:true }, 

   type: {String,
    enum: ["deposite", "withdrawal", "transfer"]
  },

  status: {
    type: String,
    default:"Success"
  },
},   { timestamps: true});

module.exports = transactionSchema;