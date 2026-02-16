import { Router } from "express";
import { validation } from "../../Middelwares/validation.middelwares.js"
import * as authService from "./auth.service.js"
import { signUpValidation , registerValidation} from "./auth.validation.js"


const router = Router()


router.post("/signUp", validation(signUpValidation), authService.signUP)
router.post("/register", validation(registerValidation), authService.registerUser)


export default router