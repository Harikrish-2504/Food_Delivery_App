const express = require('express');
const { registerContoller, authController, loginController, verifyOtpController, updateUserProfile } = require('../controller/user');
const protect = require('../middleware/authMiddleware');

router = express.Router();

router.post("/register", registerContoller);
router.post("/get-user", protect, authController);
router.post("/login", loginController);
router.post("/verifyotp", verifyOtpController);
router.put("/update", protect, updateUserProfile);
module.exports = router;
