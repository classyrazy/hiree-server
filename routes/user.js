const express = require('express');
const router = express.Router();
const requireAuth = require('../middleware/requireAuth');
const requireAuthDeveloper = require('../middleware/requireAuthDeveloper');

const {signupUser, loginUser, signupHiring,createdeveloperProfile} = require('../controllers/userController');
const { request, response } = require('express');

router.post("/signup", signupUser);
router.post("/hiring/signup", signupHiring);
router.post("/login", loginUser);
router.post("/create-profile",requireAuthDeveloper, createdeveloperProfile);

module.exports = router;