const express = require('express');
const router = express.Router();
const requireAuthHiring = require('../middleware/requireAuthHiring');

const {createJob, getAllcompanyPostedJobs, startReview, createReview, getProfile} = require('../controllers/hireController');

router.post("/create-job",requireAuthHiring, createJob);
router.get("/jobs",requireAuthHiring, getAllcompanyPostedJobs);
router.post("/review/select-skills",requireAuthHiring, startReview );
router.post("/review/create",requireAuthHiring, createReview );
router.post("/review/get-profile",requireAuthHiring, getProfile );

module.exports = router;