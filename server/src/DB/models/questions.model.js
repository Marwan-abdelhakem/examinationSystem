import mongoose, { Schema } from "mongoose";

const QuestionsSchema = new Schema(
    {
        quizId: {
            type: Schema.Types.ObjectId,
            ref: 'quizzes', //  عشان نربط اسم الامتحان بي اساله 
            required: true
        },
        questionText: {
            type: String,
            required: true
        },
        options: [{ type: String, required: true }],
        correctAnswerIndex: {
            type: Number,
            required: true
        },
        timerPerQuestion: {
            type: Number,
            default: 60
        }
    },
    {
        timestamps: true
    }
);

const QuestionsModel = mongoose.models.questions || mongoose.model("questions", QuestionsSchema);

export default QuestionsModel;