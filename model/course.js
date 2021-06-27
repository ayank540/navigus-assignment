const mongoose = require("mongoose")

const CourseSchema = new mongoose.Schema({
    courseId: {type: String, required: true, unique: true},
    courseName: {type: String, required: true},
    createdBy: {type: String, required: true}
},
    { collection: 'courses' }
)

const model = mongoose.model("CourseSchema", CourseSchema)

module.exports = model