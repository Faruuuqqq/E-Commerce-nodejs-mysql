const express = require("express");
const router = express.Router();
const authenticateUser = require("../middleware/authenticateUser");
const checkoutController = require("../controllers/checkoutController");

router.get("/", authenticateUser, checkoutController.getCheckoutPage);

module.exports = router;