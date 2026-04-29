
exports.transferFunds = async (req, res) => {
    try {
        const { from, to, amount } = req.body;
        //validation
        if (!from || !to || !amount) {
            return res.status(400).json({
                status: "ERROR",
                Message: "from, to, and amount are required"
            });
        }
        const nibssResponse = await req.nibssApi.post('/api/transfer', {from,to,amount: amount.toString()
        });

        // SAVE TO DB
        await Transaction.create({
            from,
            to,
            amount,
            status: "success",
            transactionData: nibssResponse.data
        });

        res.status(200).json({
            status: "Success",
            Message: "Transfer completed successfully",
            data: nibssResponse.data
        });
    } catch (error) {
        console.error('Transfer error:', error.response?.data || error.message);
        res.status(error.response?.status || 500).json({
            status: "ERROR",
            Message: error.response?.data?.message || "Transfer failed"
        });
    }
};

exports.getTransactionStatus = async (req, res) => {
    try {
        const { transactionId } = req.params;

        if (!transactionId) {
            return res.status(400).json({
                status: "ERROR",
                Message: "Transaction ID is required"
            });
        }

        const nibssResponse = await req.nibssApi.get(`/api/transaction/${transactionId}`);

        res.status(200).json({
            status: "Success",
            data: nibssResponse.data
        });
    } catch (error) {
        console.error('Transaction status error:', error.response?.data || error.message);
        res.status(error.response?.status || 500).json({
            status: "ERROR",
            Message: error.response?.data?.message || "Transaction status check failed"
        });
    }
};

