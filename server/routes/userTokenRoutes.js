const express = require("express");
const router = express.Router();
const tokenController = require("../controllers/tokenController");

// Route to get refreshToken
router.post("/refresh", tokenController.getRefreshToken);

module.exports = router;