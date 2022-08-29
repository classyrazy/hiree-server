const express = require('express');
const router = express.Router();
const requireAuthHiring = require('../middleware/requireAuthHiring');

const {createJob, getAllcompanyPostedJobs, startReview, createReview, getReviewProfile} = require('../controllers/hireController');

router.post("/create-job",requireAuthHiring, createJob);
router.get("/jobs",requireAuthHiring, getAllcompanyPostedJobs);
router.post("/review/select-skills",requireAuthHiring, startReview );
router.post("/review/create",requireAuthHiring, createReview );
router.post("/review/get-profile",requireAuthHiring, getReviewProfile );

module.exports = router;