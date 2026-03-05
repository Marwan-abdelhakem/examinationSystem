import joi from "joi";

<<<<<<< HEAD
export const loginValidation = joi
  .object({
    email: joi.string().email().required(),
    password: joi
  .string()
  .min(8)
  .pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]+$/)
  .required()
  .messages({
    "string.min": "Password must be at least 8 characters",
    "string.pattern.base":
      "Password must contain letters and numbers only",
    "string.empty": "Password is required",
  }),
  })
  .required();

// validation for register
export const registerValidation = joi
  .object({
    firstName: joi.string().min(3).max(20).required(),
    lastName: joi.string().min(3).max(20).required(),

    email: joi.string().email().required(),

    password: joi
      .string()
      .min(8)
      .pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]+$/)
      .required()
      .messages({
        "string.min": "Password must be at least 8 characters",
        "string.pattern.base":
          "Password must contain letters and numbers only",
      }),

    confirmPassword: joi
      .string()
      .valid(joi.ref("password"))
      .required()
      .messages({
        "any.only": "Confirm password must match password",
      }),
  })
  .required();
=======
// export const signUpValidation = joi.object({
//     role: joi.string().valid('user', 'admin').required().messages({
//         "any.only": "role must be admin or user",
//         "any.required": "role is required"
//     }),
//     firstName: joi.string().min(3).max(20).required(),
//     lastName: joi.string().min(3).max(20).required(),
//     password: joi.string()
//         .min(6)
//         .pattern(/[A-z]/)
//         .pattern(/[!@#$%^&*(),.?":{}|<>_\-]/).
//         required()
//         .messages({
//             "string.min": "Password must be greater 6 ",
//             "string.pattern.name": "The password must contain a capital letter.",
//             "string.empty": "required"
//         }),
//     email: joi.string().email().required(),
// }).required()
export const registerValidation = joi
    .object({
        firstName: joi.string().min(3).max(20).required(),
        lastName: joi.string().min(3).max(20).required(),

        email: joi.string().email().required(),

        password: joi
            .string()
            .min(8)
            .pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]+$/)
            .required()
            .messages({
                "string.min": "Password must be at least 8 characters",
                "string.pattern.base":
                    "Password must contain letters and numbers only",
            }),

        confirmPassword: joi
            .string()
            .valid(joi.ref("password"))
            .required()
            .messages({
                "any.only": "Confirm password must match password",
            }),
    })
    .required();
>>>>>>> origin/master
