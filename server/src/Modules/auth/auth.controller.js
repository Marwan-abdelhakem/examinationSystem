import { Router } from "express";
<<<<<<< HEAD
import { validation } from "../../Middelwares/validation.middelwares.js";
import * as authService from "./auth.service.js";
import { loginValidation, registerValidation } from "./auth.validation.js";
=======
import { validation } from "../../Middelwares/validation.middelwares.js"
import * as authService from "./auth.service.js"
import { registerValidation } from "./auth.validation.js"
>>>>>>> origin/master

const router = Router();

router.post("/login", validation(loginValidation), authService.login);
router.post(
  "/register",
  validation(registerValidation),
  authService.registerUser,
);

<<<<<<< HEAD
export default router;
=======

// router.post("/signUp", validation(signUpValidation), authService.signUP)
router.post(
    "/register",
    // validation(registerValidation),
    authService.registerUser,
);


router.post("/login", authService.login)



export default router
>>>>>>> origin/master
