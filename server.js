const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
dotenv.config();
const app = express();
const userRoutes = require("./routes/user")
let PORT = process.env.PORT || 3000

var whitelist = ['http://localhost:3000', 'https://hiree.vercel.app/']
var corsOptions = {
    origin: function (origin, callback) {
        if (whitelist.indexOf(origin) !== -1) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    }
}
app.use(cors(corsOptions));
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
})
app.use(express.json());
app.use("/api/user", userRoutes);
app.post("/test", (req, res) => {
    console.log(req.body)
    res.send("hello")
})
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})
