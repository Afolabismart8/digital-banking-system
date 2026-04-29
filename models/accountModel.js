const mongoose = require("mongoose");

const createAccountSchema = new mongoose.Schema ({
    kycType:{ type:String,
        require:true
    },
    kycID: {
        type:String,
        require:true
    },
    dob: {
        type:String,
        require:true
    }
});

module.exports = mongoose.model ("account", createAccountSchema);