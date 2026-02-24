import express from "express";
import {
  startExam,
  saveAnswer,
  submitExam
} from "./examCotroller.js";
import {startExamSchema, saveAnswerSchema, submitExamSchema} from "./examValidation.js"
import { validation } from "../../Middelwares/validation.middelwares.js";
import { authentication } from "../../Middelwares/auth.middlewares.js"

const router = express.Router();

router.post("/start/:quizId", authentication,validation(startExamSchema),  startExam);
router.post("/answer",validation(saveAnswerSchema),  saveAnswer);
router.post("/submit",validation(submitExamSchema),  submitExam);

export default router;