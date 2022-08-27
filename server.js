const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
dotenv.config();
const app = express();
const userRoutes = require("./routes/user")
let PORT = process.env.PORT || 3000

app.use(cors());
app.use(express.json());
app.use("/api/user",userRoutes);
app.post("/test", (req, res) => {
    console.log(req.body)
    res.send("hello")
})
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})
