const express = require('express');
const router = express.Router();
const requireAuth = require('../middleware/requireAuth');
const requireAuthDeveloper = require('../middleware/requireAuthDeveloper');

const {signupUser, loginUser, signupHiring,createdeveloperProfile, getLoggedInUser, getDeveloperProfile} = require('../controllers/userController');
const { request, response } = require('express');

router.post("/signup", signupUser);
router.get("/get-user",requireAuth,getLoggedInUser);
router.get("/get-developer/:id",requireAuth,getDeveloperProfile);
router.post("/hiring/signup", signupHiring);
router.post("/login", loginUser);
router.post("/create-profile",requireAuthDeveloper, createdeveloperProfile);
// router.post("/create-profile", createdeveloperProfile);

module.exports = router;