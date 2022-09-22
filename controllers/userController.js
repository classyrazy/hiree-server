const db = require('../configs/dbconfig');
const SCHEMA = process.env.INSTANCE_SCHEMA;
const bycrypt = require('bcrypt')
const validator = require('validator')
const jwt = require('jsonwebtoken')

function createToken(id) {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '3d' })
}
// signup ordinary user

async function signupUser(req, res, next) {
    console.log(req.body)
    // check if user exists
    const { email, password } = req.body
    if (!email || !password) {
        return res.status(400).json({ error: "Please enter all fields" })
    }
    if (!validator.isEmail(email)) {
        return res.status(400).json({ error: "Please enter a valid email" })
    }
    const user = await db.searchByValue({
        table: "user",
        searchAttribute: "email",
        searchValue: email,
        attributes: ["*"],
    })
    if (user.data.length > 0) return res.status(400).json({ error: "user already exists" })

    // hash password
    const salt = await bycrypt.genSalt(10)
    const hashedPassword = await bycrypt.hash(password, salt)

    // create user
    try {
        const user = await db.insert(
            {
                table: 'user',
                records: [
                    {
                        email: email,
                        password: hashedPassword,
                        type: "ordinary",
                    }
                ]
            }
        )
        db.searchByValue(
            {
                operation: "search_by_value",
                table: "user",
                searchAttribute: "id",
                searchValue: user.data.inserted_hashes[0],
                attributes: ["*"],
            }, (err, response) => {
                if (err) {
                    next(new Error(err.error))
                }
                console.log(response)
                const token = createToken(user.data.inserted_hashes[0])
                console.log(token)
                res.status(response.statusCode).json({ email: response.data[0].email, token: token });
            }
        );

    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}
async function loginUser(req, res) {
    const { email, password } = req.body
    if (!email || !password) {
        return res.status(400).json({ error: "Please enter all fields" })
    }
    try {
        // db.searchByValue(
        //     {
        //         operation: "search_by_value",
        //         table: "user",
        //         searchAttribute: "email",
        //         searchValue: email,
        //         attributes: ["*"],
        //     }, async (err, response) => {
        //         if (err) {
        //             throw (err.error)
        //         }
        //         // check if password is correct
        //         if (response.data.length === 0) return res.status(400).json({ error: "user does not exist" })
        //         const user = response.data[0]
        //         const isPasswordCorrect = await bycrypt.compare(password, user.password)
        //         console.log({ isPasswordCorrect })
        //         if (!isPasswordCorrect) {
        //             return res.status(400).json({ error: "Incorrect password" })
        //         }
        //         const token = createToken(user.id)

        //         console.log(token)
        //         res.status(response.statusCode).json({ email: user.email, token: token });
        //     }

        // );
        const QUERY = `SELECT * FROM ${SCHEMA}.user  WHERE email = "${email}"`
        let user = await db.query(QUERY)
        if (user.data.length === 0) throw new Error("user does not exist")
        user = user.data[0]
        const isPasswordCorrect = await bycrypt.compare(password, user.password)
        if (!isPasswordCorrect) {
            throw new Error("Incorrect details")
        }
        const token = createToken(user.id)
        res.status(200).json({ email: user.email, token: token, type: user.type });
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}
async function signupHiring(req, res, next) {

    // check if user exists
    const { email, password, name } = req.body
    if (!email || !password || !name) {
        return res.status(400).json({ error: "Please enter all fields" })
    }
    if (!validator.isEmail(email)) {
        return res.status(400).json({ error: "Please enter a valid email" })
    }
    const user = await db.searchByValue({
        table: "user",
        searchAttribute: "email",
        searchValue: email,
        attributes: ["*"],
    })
    if (user.data.length > 0) return res.status(400).json({ error: "user already exists" })

    // hash password
    const salt = await bycrypt.genSalt(10)
    const hashedPassword = await bycrypt.hash(password, salt)

    // create user
    try {
        const user = await db.insert(
            {
                table: 'user',
                records: [
                    {
                        company_name: name,
                        email: email,
                        password: hashedPassword,
                        type: "hiring-manager",
                    }
                ]
            }
        )
        db.searchByValue(
            {
                operation: "search_by_value",
                table: "user",
                searchAttribute: "id",
                searchValue: user.data.inserted_hashes[0],
                attributes: ["*"],
            }, (err, response) => {
                if (err) {
                    next(new Error(err.error))
                }
                console.log(response)
                const token = createToken(user.data.inserted_hashes[0])
                console.log(token)
                res.status(response.statusCode).json({ email: response.data[0].email, token: token, type: response.data[0].type });
            }
        );

    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}
async function createdeveloperProfile(req, res, next) {
    console.log(req.body)
    const { firstname, lastname, whoAreYou, pronouns, funFact, experience, portfolio, twitter, linkedin, github, file, skills, country,city, workmodel, jobLocationType, jobInterests, skillsImprovement } = req.body
    if (!firstname || !lastname || !whoAreYou || !pronouns || !experience || !twitter || !twitter || !github || !file || !skills || !country || !city || !workmodel || !jobLocationType || !jobInterests || !skillsImprovement) {
        return res.status(400).json({ error: "Please enter all required fields" })
    }
    let computedDeveloperGithubUsername = github.split('/')[3]
    // fetch github data
    const githubUserDataReq = await fetch(`https://api.github.com/users/${computedDeveloperGithubUsername}`)
    const githubUserData = await githubUserDataReq.json()
    try {
        // Remember to add multer 
        const userProfile = await db.insert({
            table: 'developer_profile',
            records: [{
                email: req.user.email,
                firstname: firstname,
                lastname: lastname,
                whoAreYou: whoAreYou,
                pronouns: pronouns,
                funFact: funFact,
                experience: experience,
                portfolio: portfolio,
                twitter: twitter,
                linkedin: linkedin,
                github: github,
                file: file,
                skills: skills,
                country: country,
                city: city,
                workmodel: workmodel,
                jobLocationType: jobLocationType,
                jobInterests: jobInterests,
                skillsImprovement: skillsImprovement,
                githubUserData: githubUserData
            }],
        }, (err, response) => {
            if (err) {
                next(new Error(err.error))
            }
            console.log(response)
            res.status(response.statusCode).json({ message: "Profile created"});
        })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }

}
module.exports = {
    signupUser,
    loginUser,
    signupHiring,
    createdeveloperProfile,
}
