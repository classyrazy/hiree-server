const express = require('express');
const router = express.Router();
const requireAuthDeveloper = require('../middleware/requireAuthDeveloper');

const {getSingleJob, applyForJob} = require('../controllers/jobController');
router.get("/:id", getSingleJob);
router.post("/apply", requireAuthDeveloper, applyForJob);

module.exports = router;