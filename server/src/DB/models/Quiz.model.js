import mongoose, { Schema } from "mongoose";

const QuizSchema = new Schema({
    quizName: {
        type: String,
        required: [true, "Name Quiz is required "],
        unique: true,
        lowercase: true,
        trim: true
    },
    totalQuestions: { type: Number, default: 0 }
}, { timestamps: true });


const QuizModel = mongoose.models.Quiz || mongoose.model("Quiz", QuizSchema);

export default QuizModel;

