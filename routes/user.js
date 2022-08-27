const express = require('express');
const router = express.Router();
const {signupUser, loginUser, signupHiring} = require('../controllers/userController')

router.post("/signup", signupUser);
router.post("/hiring/signup", signupHiring);
router.post("/login", loginUser);

module.exports = router;