const mongoose = require("mongoose")
const { collection } = require("./teacher")

const QuestionSchema = new mongoose.Schema({
    question_no: { type: String, required=true},
    question: {type: String},
    answers: {
        correct: [String],
        incorrect: [String]
    }
},
    { collection: 'questions' }
)

const model = mongoose.model("QuestionSchema", QuestionSchema)

module.exports = model