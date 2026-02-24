import mongoose, { Schema } from "mongoose";

const ExamAttemptSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },

    quizId: {
      type: Schema.Types.ObjectId,
      ref: "Quiz",
      required: true,
    },

    attemptNumber: {
      type: Number,
      required: true,
    },

    questionsOrder: [
      {
        type: Schema.Types.ObjectId,
        ref: "questions",
      },
    ],

    answers: [
      {
        questionId: {
          type: Schema.Types.ObjectId,
          ref: "questions",
          required: true,
        },
        selectedOptionIndex: {
          type: Number,
          required: true,
        },
      },
    ],

    startedAt: {
      type: Date,
      default: Date.now,
    },

    endAt: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: ["in-progress", "submitted"],
      default: "in-progress",
    },

    score: {
      type: Number,
      default: 0,
    },
    sessionActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

export default mongoose.model("ExamAttempt", ExamAttemptSchema);
