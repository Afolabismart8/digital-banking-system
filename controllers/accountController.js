const accountModel = require ("../models/accountModel");

exports.createAccount = async (req, res) => {
    try { const { kycType, kycID, dob } = req.body;
        if (!kycType || !kycID || !dob) {
            return res.status(400).json({ status: "ERROR",
                Message: "kycType, kycID, and dob are required" });
        }
       const nibssResponse = await req.nibssApi.post('/api/account/create', { kycType,kycID,dob});
            // SAVE TO YOUR DB
        await accountModel.create({
            kycType,
            kycID,
            dob,
            accountData: nibssResponse.data
        });

       res.status(201).json({
            status: "Success",
            Message: "Account created successfully",
            data: nibssResponse.data
        });

    } catch (error) {
        console.error('Account creation error:', error.response?.data || error.message);
        res.status(error.response?.status || 500).json({
            status: "ERROR",
            Message: error.response?.data?.message || "Account creation failed"
        });
    }
};

exports.nameEnquiry = async (req, res) => {
    try {const { accountNumber } = req.params;
        if (!accountNumber) { return res.status(400).json({
                status: "ERROR",
                Message: "Account number is required"});
        };
        const nibssResponse = await req.nibssApi.get(`/api/account/name-enquiry/${accountNumber}`);
            res.status(200).json({
            status: "Success",
            data: nibssResponse.data });
    } catch (error) {
        console.error('Name enquiry error:', error.response?.data || error.message);
        res.status(error.response?.status || 500).json({
            status: "ERROR",
            Message: error.response?.data?.message || "Name enquiry failed"
        });
    }
};

exports.getAllAccounts = async (req, res) => {
    try {const nibssResponse = await req.nibssApi.get('/api/accounts');
            res.status(200).json({
            status: "Success",
            data: nibssResponse.data });
    } catch (error) {
        console.error('Get accounts error:', error.response?.data || error.message);
        res.status(error.response?.status || 500).json({
            status: "ERROR",
            Message: error.response?.data?.message || "Failed to retrieve accounts"
        });
    }
};



exports.getAccountBalance = async (req, res) => {
    try { const { accountNumber } = req.params;
          if (!accountNumber) {
            return res.status(400).json({
                status: "ERROR",
                Message: "Account number is required" });
        } const nibssResponse = await req.nibssApi.get(`/api/account/balance/${accountNumber}`);
            res.status(200).json({
            status: "Success",
            data: nibssResponse.data });
    } 
    catch (error) {
        console.error('Balance check error:', error.response?.data || error.message);
        res.status(error.response?.status || 500).json({
            status: "ERROR",
            Message: error.response?.data?.message || "Balance check failed"
        });
    }
};



