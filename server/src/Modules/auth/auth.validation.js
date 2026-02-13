import joi from "joi"

export const signUpValidation = joi.object({
    firstName: joi.string().min(3).max(20).required(),
    lastName: joi.string().min(3).max(20).required(),
    password: joi.string()
        .min(6)
        .pattern(/[A-z]/)
        .pattern(/[!@#$%^&*(),.?":{}|<>_\-]/).
        required()
        .messages({
            "string.min": "Password must be greater 6 ",
            "string.pattern.name": "The password must contain a capital letter.",
            "string.empty": "required"
        }),
    email: joi.string().email().required(),
}).required()