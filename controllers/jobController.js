const db = require('../configs/dbconfig');
const SCHEMA = process.env.INSTANCE_SCHEMA;

async  function getSingleJob(req, res, next) {
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
async  function applyForJob(req, res, next) {
    console.log("apllyjobs")
    const { id } = req.body;
    try {
        const Query = `SELECT * FROM ${SCHEMA}.jobs WHERE id = "${id}"`
        const job = await db.query(Query)
        db.update(
            {
              operation: "update",
              table: "jobs",
              records: [{
                id: id,
                applications: [...job.data[0].applications, req.user.id]
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

module.exports = {
    getSingleJob,
    applyForJob
};