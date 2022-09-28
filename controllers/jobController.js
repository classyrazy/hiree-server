const db = require('../configs/dbconfig');
const SCHEMA = process.env.INSTANCE_SCHEMA;

async function getSingleJob(req, res, next) {
  const { _id } = req.query;
  console.log("getSingleJob", _id)
  try {
    const Query = `SELECT * FROM ${SCHEMA}.jobs WHERE id = "${_id}"`
    const job = await db.query(Query)
    console.log(job.data)
    res.status(200).json(job.data)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
async function applyForJob(req, res, next) {
  const { id } = req.body;
  try {
    const Query = `SELECT * FROM ${SCHEMA}.jobs WHERE id = "${id}"`
    const job = await db.query(Query)
    // job.data[0].applications.
    if (job.data[0].applications.indexOf(req.user.dev_profile_id) !== -1) {
      return res.status(500).json({ error: "You have applied for this job already" });
    }
    console.log("apllyjobs", job.data[0].applications.indexOf(req.user.dev_profile_id))
    // return
    db.update(
      {
        operation: "update",
        table: "jobs",
        records: [{
          id: id,
          applications: [...job.data[0].applications, { id: req.user.dev_profile_id }]
        }],
      },
      (err, response) => {
        if (err) {
          return res.status(500).json(err);
        }

        res.status(response.statusCode).json(response.data);
      }
    );
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
async function createJobReview(req, res, next) {
  const { jobId } = req.body;
  if (!jobId) {
    return res.status(400).json({ error: "Please enter all fields" })
  }
  const QUERY = `SELECT * FROM ${SCHEMA}.jobs WHERE id = "${jobId}"`
  const job = await db.query(QUERY)
  try {
    const newReview = await db.insert({
      table: 'review',
      records: [{
        company_id: req.user.id,
        developer_array: job.data[0].applications,
        status: "pending",
        skills_selected: job.data[0].skills,
        job_id: jobId

      }],
    })
    db.upsert(
      {
        operation: "upsert",
        table: "jobs",
        records: [{
          id: jobId,
          review_id: newReview.data.inserted_hashes[0]
        }],
      },
      (err, response) => {
        if (err) {
          return res.status(500).json(err);
        }
        res.status(200).json(newReview.data.inserted_hashes[0])
      }
    );
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}


module.exports = {
  getSingleJob,
  applyForJob,
  createJobReview
};