const mongoose = require("mongoose")

const TeacherSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
},
    { collection: 'teachers' }
)

const model = mongoose.model("TeacherSchema", TeacherSchema)

module.exports = model