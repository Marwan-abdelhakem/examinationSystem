import { Router } from "express";
import { validation } from "../../Middelwares/validation.middelwares.js"
import * as authService from "./auth.service.js"
import { registerValidation } from "./auth.validation.js"


const router = Router()


// router.post("/signUp", validation(signUpValidation), authService.signUP)
router.post(
    "/register",
    // validation(registerValidation),
    authService.registerUser,
);


router.post("/login", authService.login)



export default router
