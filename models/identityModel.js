const mongoose = require("mongoose");

const identitySchema = new mongoose.Schema({
    type: { type: String,  enum: ["bvn", "nin"],required: true},
    idNumber: { type: String,required: true, match: [/^\d{11}$/, "Must be exactly 11 digits"]},
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    dob: { type: String, required: true },
    phone: { type: String },
    status: { type: String, enum: ["verified", "validated"]}

}, { timestamps: true });

const validationSchema = new mongoose.Schema({
    type: { type: String,enum: ["bvn", "nin"],required: true},
    idNumber: { type: String, required: true,
    match: [/^\d{11}$/, "Must be exactly 11 digits"]
    }
}, { timestamps: true });

const Identity = mongoose.model("Identity", identitySchema);
const Validate = mongoose.model("Validate", validationSchema);
module.exports = { Identity, Validate};