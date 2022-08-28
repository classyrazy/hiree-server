const express = require('express');
const router = express.Router();
const requireAuthHiring = require('../middleware/requireAuthHiring');

const {createJob, getAllcompanyPostedJobs} = require('../controllers/hireController');

router.post("/create-job",requireAuthHiring, createJob);
router.get("/jobs",requireAuthHiring, getAllcompanyPostedJobs);

module.exports = router;