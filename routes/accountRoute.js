const express = require("express");
const router = express.Router();
const {createAccount,getAccountBalance,nameEnquiry,getAllAccounts} = require ("../controllers/accountController");
const  {getNIBSSApi}  = require("../Middlewares/authMiddleware");



// Protected routes (JWT authentication required)
router.post("/account/create", getNIBSSApi,createAccount);
router.get("/account/balance/:accountNumber", getNIBSSApi,getAccountBalance);
router.get("/account/name-enquiry/:accountNumber", getNIBSSApi,nameEnquiry);
router.get("/accounts", getNIBSSApi, getAllAccounts);

module.exports = router;