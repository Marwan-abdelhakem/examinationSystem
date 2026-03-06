import joi from "joi";

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
    role: joi.string().valid('admin', 'user').default('user'),
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
