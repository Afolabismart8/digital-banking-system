const { onboard, login } = require("../models/onboardingModel");
const { nibssApi } = require("../configs/nibssbyPhoenix");
const { Identity, Validate } = require("../models/identityModel");
const { validate } = require("../models/accountModel");

exports.createFintech = async (req, res, next) => {
    try {const { name, email } = req.body;
// validation
        if (!name || !email) {return res.status(400).json({
                status: "ERROR",
                Message: "All fields required" });
        }
 // check if email exists
        const existing = await onboard.findOne({ email });
        if (existing) { return res.status(400).json({
                status: "ERROR",
                Message: "email already exists" });
        } const localFintech = await onboard.create({ name, email });

        let nibssData = null;

        try { const nibssResponse = await nibssApi.post( "/api/fintech/onboard", { name, email }
            ); 
            nibssData = nibssResponse.data;
            await onboard.findByIdAndUpdate(localFintech._id, {
                apiKey: nibssData.apiKey,
                apiSecret: nibssData.apiSecret,
                bankCode: nibssData.bankCode,
                bankName: nibssData.bankName,
                nibssOnboarded: true});

            await login.create({
                apiKey: nibssData.apiKey,
                apiSecret: nibssData.apiSecret,
                fintechId: localFintech._id
            });

        } catch (apiError) {
            console.warn("NIBSS API call failed:", apiError.message);

            await onboard.findByIdAndDelete(localFintech._id);

            return res.status(500).json({
                status: "ERROR",
                Message: "NIBSS onboarding failed. Please try again.",
                error: process.env.NODE_ENV === "development"
                    ? apiError.message
                    : undefined
            });
        }

        res.status(201).json({
            status: "Success",
            Message: "Fintech onboarded successfully",
            data: {
                id: localFintech._id,
                name: localFintech.name,
                email: localFintech.email,
                nibssOnboarded: !!nibssData
            },
            nibssData
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: "Error",
            Message: "Internal server Error"
        });
    }
};
//LoginFintech
exports.loginFintech = async (req, res, next) => {
    try {const { apiKey, apiSecret } = req.body;
        if (!apiKey || !apiSecret) {
            return res.status(400).json({
                status: "ERROR",
                Message: "API key and secret required"
            });
        }
        const loginRecord = await login.findOne({ apiKey, apiSecret });
        if (!loginRecord) {
            return res.status(401).json({
                status: "ERROR",
                Message: "Fintech not found in local database. Please onboard first."
            });
        }
        let localFintech;

        if (loginRecord.fintechId) {
            localFintech = await onboard.findById(loginRecord.fintechId);
        } else {
            localFintech = await onboard.findOne({ apiKey, apiSecret });
        }

        if (!localFintech) {
            return res.status(401).json({
                status: "ERROR",
                Message: "Fintech onboard record not found."
            });
        }
        let token = null;
        let fintechData = null;

        try {
            const nibssResponse = await nibssApi.post(
                "/api/auth/token",
                { apiKey, apiSecret }
            );

            token = nibssResponse.data.token;
            fintechData = nibssResponse.data.fintech;

        } catch (apiError) {
            return res.status(apiError.response?.status || 401).json({
                status: "ERROR",
                Message:
                    apiError.response?.data?.message ||
                    "Invalid credentials or NIBSS service unavailable"
            });}
        res.status(200).json({
            status: "Success",
            Message: "Login successful",
            token,
            fintech: {
                id: localFintech._id,
                name: localFintech.name,
                email: localFintech.email,
                bankCode: fintechData?.bankCode,
                bankName: fintechData?.bankName
            }});
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: "Error",
            Message: "Internal server Error" });
    }};
// BVN 
exports.insertBvn = async (req, res) => {
    try {const { bvn, firstName, lastName, dob, phone } = req.body;
        if (!bvn || !firstName || !lastName || !dob || !phone) {
            return res.status(400).json({
                status: "error",
                Message: "bvn, firstName, lastName, dob, phone are required"
            });
        }
        const nibssResponse = await nibssApi.post("/api/insertBvn",{ bvn, firstName, lastName, dob, phone }
        );
        const data = nibssResponse.data;
        //SAVE TO DB
        await Identity.create({
            type: "bvn",
            idNumber: bvn,
            firstName:data.firstName,
            lastName:data.lastName,
            dob:data.dob,
            phone:data.phone,
            status: "verified"
        });
        res.status(201).json({
            status: "Success",
            Message: "BVN Record Created Successfully",
            data
        });

    } catch (error) {
        console.error(error.response?.data || error.message);

        return res.status(error.response?.status || 500).json({
            status: "ERROR",
            message: error.response?.data?.message || error.message
        });
    }
};
// NIN
exports.insertNin = async (req, res) => {
    try {const { nin, firstName, lastName, dob } = req.body;
        if (!nin || !firstName || !lastName || !dob) {
            return res.status(400).json({
                status: "error",
                Message: "nin, firstName, lastName, dob are required" });
        }
        const nibssResponse = await nibssApi.post( "/api/insertNin", { nin, firstName, lastName, dob }
        );
        const data = nibssResponse.data;
        // SAVE TO DB
        await Identity.create({
            type: "nin",
            idNumber:nin,
            firstName:data.firstName,
            lastName:data.lastName,
            dob:data.dob,
            phone:data.dob,
            status: "verified"
        });
        res.status(201).json({
            status: "Success",
            Message: "NIN Record Created Successfully",
            data
        });

    } catch (error) {
        console.error(error.response?.data || error.message);

        return res.status(error.response?.status || 500).json({
            status: "ERROR",
            message: error.response?.data?.message || error.message
        });
    }
};
// VALIDATE BVN 
exports.validateBvn = async (req, res) => {
    try {const { bvn } = req.body;
        if (!bvn) {return res.status(400).json({
                status: "Error",
                message: "bvn is required"});}
        const nibssResponse = await nibssApi.post("/api/validateBvn",{ bvn }
        );

        const data = nibssResponse.data;
        //SAVE TO DB
        await Validate.create({
            type: "bvn",
            idNumber: bvn,
            firstName:data.firstName,
            lastName:data.lastName,
            dob:data.dob,
            phone:data.phone,
            status: "verified"
        });
        res.status(200).json({
            status: "Success",
            message: "BVN validation successful",
            data
        });

    } catch (error) {
        console.error(error.response?.data || error.message);

        return res.status(error.response?.status || 500).json({
            status: "ERROR",
            message: error.response?.data?.message || error.message
        });
    }
};

// VALIDATE NIN 
exports.validateNin = async (req, res) => {
    try { const { nin } = req.body;
        if (!nin) {
            return res.status(400).json({
                status: "Error",
                message: "nin is required"
            });
        }
        const nibssResponse = await nibssApi.post( "/api/validateNin", { nin }
        );
        const data = nibssResponse.data;
        //SAVE TO DB
        await Validate.create({
            type: "nin",
            idNumber: nin,
            firstName:data.firstName,
            lastName:data.lastName,
            dob:data.dob,
            phone:data.phone,
            status: "verified"
        });
        res.status(200).json({
            status: "Success",
            message: "NIN validation successful",
            data
        });
    } catch (error) {
        console.error(error.response?.data || error.message);
        return res.status(error.response?.status || 500).json({
            status: "ERROR",
            message: error.response?.data?.message || error.message
        });
    }
};