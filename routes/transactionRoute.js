const express = require("express");
const router = express.Router();
const {transferFunds,getTransactionStatus} = require("../controllers/transactionController");
const { getNIBSSApi } = require("../middlewares/authMiddleware");



// Protected routes (JWT authentication required)
router.post("/transfer", getNIBSSApi, transferFunds);
router.get("/transaction/:transactionId", getNIBSSApi, getTransactionStatus);

module.exports = router;