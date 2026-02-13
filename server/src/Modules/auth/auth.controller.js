import { Router } from "express";
import { validation } from "../../Middelwares/validation.middelwares.js"
import * as authService from "./auth.service.js"
import { signUpValidation } from "./auth.validation.js"


const router = Router()


router.post("/signUp", validation(signUpValidation), authService.signUP)



export default router
