const express = require("express")
const path = require("path")
const mongoose = require("mongoose")
const Teacher = require("./model/teacher")
const Course = require("./model/course")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

const JWT_SECRET = "afsfinufiivqnfklsdjfksdajfkdsvmcxbvjjqijf8943tdiufht894u59843hjg"

mongoose.connect("mongodb+srv://ayan:ayan@cluster0.p1s72.mongodb.net/myFirstDatabase?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
})

const app = express()
app.use("/", express.static(path.join(__dirname, "static")))
app.use(express.json())

app.post("/api/delete-course", async (req, res) => {
    const id = req.body.courseId
    console.log(typeof(id))
    const courseId = await Course.findOne({"courseId": id }).lean()
    if (!courseId) {
        return res.json({ status: "error", error: "invalid course ID" })
    }
    await Course.findOneAndDelete({ "courseId": courseId }, (error)=>{
        if(error){
            res.json({status: "error", error: "Unable to remove"})
        }else{
            res.json({status: "ok"})
        }
    })
})

app.post("/api/add-course", async (req, res) => {
    const { courseId, courseName, createdBy } = req.body
    try {
        const response = await Course.create({
            courseId,
            courseName,
            createdBy
        })
    } catch (error) {
        if (error.code === 11000) {
            return res.json({ status: "error", error: "course is already here!" })
        }
        throw error
    }
    res.json({ status: "ok" })
})

app.post("/api/change-password", async (req, res) => {
    const { token, newPassword: plainTextPassword } = req.body
    try {
        const user = jwt.verify(token, JWT_SECRET)
        const _id = user.id
        const password = await bcrypt.hash(plainTextPassword, 10)
        await Teacher.updateOne(
            { _id },
            {
                $set: { password }
            }
        )
        res.json({ status: "ok" })
    } catch (error) {
        res.json({ status: "error", error: "Do not mess around!" })
    }
})

app.post("/api/login", async (req, res) => {
    const { username, password } = req.body
    const user = await Teacher.findOne({ username }).lean()

    if (!user) {
        return res.json({ status: "error", error: "Inavlid username/password" })
    }

    if (await bcrypt.compare(password, user.password)) {
        // username, password combination is successful

        const token = jwt.sign({
            id: user._id,
            username: user.username
        }, JWT_SECRET)

        return res.json({ status: "ok", data: token })
    }

    res.json({ status: "error", error: "Invalid username/password", data: "" })
})

app.post("/api/register", async (req, res) => {
    const { username, password: plainTextPassword } = req.body
    if (!username || typeof username !== 'string') {
        return res.json({ status: "error", error: "Invalid username" })
    }
    if (!plainTextPassword || typeof plainTextPassword !== 'string') {
        return res.json({ status: "error", error: "Invalid password" })
    }
    const password = await bcrypt.hash(plainTextPassword, 10)
    try {
        const response = await Teacher.create({
            username,
            password
        })
    } catch (error) {
        if (error.code === 11000) {
            // duplicate key
            return res.json({ status: "error", error: "username already in use" })
        }
        throw error
    }
    res.json({ status: 'ok' })
})

app.listen(3333, () => {
    console.log("S3rV3r up at 3333")
})