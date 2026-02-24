import Joi from "joi";
import mongoose from "mongoose";


// START EXAM VALIDATION


export const startExamSchema = Joi.object({
  quizId: Joi.string()
    .required()
    .custom((value, helpers) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        return helpers.error("any.invalid");
      }
      return value;
    }, "ObjectId validation")
});


// SAVE ANSWER VALIDATION


export const saveAnswerSchema = Joi.object({
  attemptId: Joi.string()
    .required()
    .custom((value, helpers) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        return helpers.error("any.invalid");
      }
      return value;
    }),

  questionId: Joi.string()
    .required()
    .custom((value, helpers) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        return helpers.error("any.invalid");
      }
      return value;
    }),

  selectedOptionIndex: Joi.number()
    .required()
    .min(0)
});


// SUBMIT EXAM VALIDATION


export const submitExamSchema = Joi.object({
  attemptId: Joi.string()
    .required()
    .custom((value, helpers) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        return helpers.error("any.invalid");
      }
      return value;
    })
});