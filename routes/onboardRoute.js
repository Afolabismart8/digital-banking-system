const express = require("express");
const router = express.Router();
const { createFintech, loginFintech, insertBvn, insertNin, validateBvn, validateNin} = require("../controllers/onboardingController");
const {adminOnly} = require ("../Middlewares/adminMiddlware");

// Public routes (no authentication required)
router.post("/fintech/onboard",createFintech);
router.post("/auth/token", loginFintech);
router.post("/insertBvn",adminOnly, insertBvn);
router.post("/insertNin", adminOnly, insertNin);
router.post("/validateBvn", validateBvn);
router.post("/validateNin", validateNin);

module.exports = router;

