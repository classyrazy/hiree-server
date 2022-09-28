const express = require('express');
const router = express.Router();
const requireAuthDeveloper = require('../middleware/requireAuthDeveloper');
const requireAuthHiring = require('../middleware/requireAuthHiring');

const {getSingleJob, applyForJob, createJobReview} = require('../controllers/jobController');
router.get("/:id", getSingleJob);
router.post("/apply", requireAuthDeveloper, applyForJob);
router.post("/create-job-review", requireAuthHiring, createJobReview);

module.exports = router;