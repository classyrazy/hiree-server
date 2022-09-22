const db = require('../configs/dbconfig');
const SCHEMA = process.env.INSTANCE_SCHEMA;



async function createJob(req, res, next) {
    console.log(req.body)
    const { companyName, workModel, title, description, jobLocationType, skills } = req.body
    if (!companyName || !workModel || !title || !description || !jobLocationType || !skills) {
        return res.status(400).json({ error: "Please enter all fields" })
    }
    // db.searchByValue({
    //     table: "jobs",
    //     searchAttribute: "skills",
    //     searchValue: "*",
    //     attributes: ["id", "skills"],
    // },(err, response) => {
    //     if (err) {
    //         next(new Error(err.error))
    //     }
    //     // console.log(response.data)
    //     if(response.data.length > 0){
    //         // for(let i = 0; i < response.data.length; i++){
    //         //     if(response.data[i].skills === skills){
    //         //         return res.status(400).json({ error: "job already exists" })
    //         //     }
    //         // }
    //         response.data.forEach(element => {
    //             if(element.skills.includes(["html","css"])){
    //                 console.log("html", element)
    //             }
    //         })
    //     }

    // })
    try {
        // Remenber to add multer 
        const jobCreated = await db.insert({
            table: 'jobs',
            records: [{
                company_id: req.user.id,
                company_name: companyName,
                work_model: workModel,
                title: title,
                description: description,
                job_location_type: jobLocationType,
                skills: skills,
                applications: null

            }],
        }, (err, response) => {
            if (err) {
                next(new Error(err.error))
            }
            console.log(response)
            res.status(response.statusCode).json({ message: "Job created", data: response.data[0] });
        })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }

}

async function getAllcompanyPostedJobs(req, res, next) {
    try {
        const Query = `SELECT * FROM ${SCHEMA}.jobs WHERE company_id = "${req.user.id}"`
        const allcompanyPostedJobs = await db.query(Query)
        res.status(200).json(allcompanyPostedJobs.data)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}
async function getAllJobs(req, res, next) {
    try {
        const Query = `SELECT * FROM ${SCHEMA}.jobs`
        const allPostedJobs = await db.query(Query)
        res.status(200).json(allPostedJobs.data)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}
async function getAllcompanyReview(req, res, next) {
    try {
        const Query = `SELECT * FROM ${SCHEMA}.review WHERE company_id = "${req.user.id}"`
        const allcompanyReview = await db.query(Query)
        res.status(200).json(allcompanyReview.data)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}
async function startReview(req, res, next) {
    const { skills } = req.body;
    if (!skills) {
        return res.status(400).json({ error: "Please enter all fields" })
    }
    let testArr = []
    try {

        db.searchByValue({
            table: "developer_profile",
            searchAttribute: "id",
            searchValue: "*",
            attributes: ["id", "skills"],
        }, (err, response) => {
            if (err) {
                next(new Error(err.error))
            }
            res.status(200).json(response.data)
        })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}
async function createReview(req, res, next) {
    const { developersArr, skillsArr } = req.body;
    if (!developersArr || !skillsArr) {
        console.log("developersArr", developersArr, "skills", skillsArr)
        return res.status(400).json({ error: "Please enter all fields" })
    }
    try {
        const newReview = await db.insert({
            table: 'review',
            records: [{
                company_id: req.user.id,
                developer_array: developersArr,
                status: "pending",
                skills_selected: skillsArr
            }],
        })
        res.status(200).json(newReview.data)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }

}

async function getReviewProfile(req, res, next) {
    const { routeParam, routeQuery } = req.body;
    console.log("routeParam", routeParam, "routeQuery", routeQuery)
    try {
        const Query = `SELECT * FROM ${SCHEMA}.review WHERE id = "${routeParam}"`
        const review = await db.query(Query)
        console.log(review.data)

        // res.status(200).json(review.data)
        const Query2 = `SELECT * FROM ${SCHEMA}.developer_profile WHERE id = "${routeQuery}"`
        const developerProfile = await db.query(Query2)

        res.status(200).json({ review: review.data, developer: developerProfile.data })

    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}
async function reviewDone(req, res, next) {
    const { routeParam, reviewDetails } = req.body;
    if (!routeParam || !reviewDetails) {
        return res.status(400).json({ error: "Please enter all fields" })
    }
    try {
        db.update(
            {
                operation: "update",
                table: "review",
                records: [{
                    id: routeParam,
                    result: reviewDetails,
                    status: "complete"
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
async function getAllDevProfile(data) {
    let resultsData = []
    for(let scd of data.result){
        const Query2 = `SELECT * FROM ${SCHEMA}.developer_profile WHERE id = "${scd.devId}"`
        const developerProfile = await db.query(Query2)
        resultsData.push({ developer: developerProfile.data[0], result: scd })
    }
    return resultsData
}
async function getAllReviewDevs(req, res, next) {
    let { id } = req.params
    console.log(id)
    try {
        console.log("brooo")
        const Query1 = `SELECT * FROM ${SCHEMA}.review WHERE id = "${id}" AND status = "complete"`
        const allReviewDevs = await db.query(Query1)
        if (allReviewDevs.data.length === 0) {
            return res.status(401).json({ message: "Review Not Found" })
        }
         else if (allReviewDevs.data[0].company_id !== req.user.id) {
            return res.status(401).json({ message: "Sorry you can't view this review" })
        }
         else if (allReviewDevs.data[0].status !== "complete") {
            return res.status(401).json({ message: "Review Not Complete" })
        }
        let testDevs = await getAllDevProfile(allReviewDevs.data[0])
        console.log({testDevs})
        res.status(200).json(testDevs)
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: error.message })
    }
}

module.exports = {
    createJob,
    getAllcompanyPostedJobs,
    startReview,
    createReview,
    getReviewProfile,
    getAllJobs,
    reviewDone,
    getAllReviewDevs,
    getAllcompanyReview
}