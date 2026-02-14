import joi from "joi"

export const signUpValidation = joi.object({
    role: joi.string().valid('user', 'admin').required().messages({
        "any.only": "role must be admin or user",
        "any.required": "role is required"
    }),
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