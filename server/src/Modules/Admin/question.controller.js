import { Router } from "express";
import { validation } from "../../Middelwares/validation.middelwares.js"
import { authentication, authorization } from "../../Middelwares/auth.middlewares.js"
import * as qeustionServices from "./question.service.js"


const router = Router()

router.post("/createQuiz", qeustionServices.createQuiz)

router.get("/getQuiz/:quizName", qeustionServices.getQuiz)
router.get("/getallquiz", qeustionServices.getAllQuiz)



export default router



