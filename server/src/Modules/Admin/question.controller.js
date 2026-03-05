import { Router } from "express";
import { validation } from "../../Middelwares/validation.middelwares.js"
import { authentication, authorization } from "../../Middelwares/auth.middlewares.js"
import * as qeustionServices from "./question.service.js"



const router = Router()

router.post("/createQuiz", qeustionServices.createQuiz)

router.get("/getQuiz/:quizName", qeustionServices.getQuiz)

router.post("/save-result", authentication, qeustionServices.saveExamResult);

router.get("/getMyGrades", authentication, qeustionServices.getMyGrades);

router.get("/getAllQuiz", qeustionServices.getAllQuiz)

router.get("/getallquiz", qeustionServices.getallQuiz)


router.get("/getAllUsers", qeustionServices.getAllUsers)

export default router



