import successResponse from "../../Utlis/successRespone.utlis.js"
import UserModel from "../../DB/models/user.model.js"
import * as dbService from "../../DB/dbServices.js"
import { signToken } from "../../Utlis/token.utlis.js"
import bcrypt from "bcrypt";


// register
// @route 
// login
// @route POST /auth/login
// export const login = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     // check email
//     const user = await UserModel.findOne({ email });
//     if (!user) {
//       return res.status(400).json({ message: "Invalid email or password" });
//     }

//     // check password
//     const isMatch = await bcrypt.compare(password, user.password);

//     if (!isMatch) {
//       return res.status(400).json({ message: "Invalid email or password" });
//     }

//     // generate token
//     const token = signToken({
//       payload: {
//         _id: user._id,
//         role: user.role
//       }
//     });

//     res.status(200).json({
//       message: "Login successful",
//       token,
//       user: {
//         _id: user._id,
//         firstName: user.firstName,
//         lastName: user.lastName,
//         email: user.email,
//         role: user.role
//       }
//     });

//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

export const registerUser = async (req, res) => {
  try {
    const { role, firstName, lastName, email, password } = req.body;

    // basic validation
    // if (!name || !email || !password)
    //   return res.status(400).json({ message: "All fields are required" });

    // if (password.length < 6)
    //   return res.status(400).json({ message: "Password must be at least 6 characters" });

    // check existing email
    const userExists = await UserModel.findOne({ email });
    if (userExists)
      return res.status(400).json({ message: "User already exists" });

    // create user (role NOT from body)
    const user = await UserModel.create({
      role,
      firstName,
      lastName,
      email,
      password,
    });
    const token = signToken({
      payload: {
        _id: user._id,
        role: user.role
      }
    });

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//     const createUser = await dbService.create({ model: UserModel, data: [{ role, firstName, lastName, password, email }] })
//     return successResponse({ res, statusCode: 201, message: "User Create Successfully", data: createUser })
// }

// export const registerUser = async (req, res) => {
//     try {
//         const { firstName, lastName, email, password } = req.body;

//         // basic validation
//         // if (!name || !email || !password)
//         //   return res.status(400).json({ message: "All fields are required" });

//         // if (password.length < 6)
//         //   return res.status(400).json({ message: "Password must be at least 6 characters" });

//         // check existing email
//         const userExists = await UserModel.findOne({ email });
//         if (userExists)
//             return res.status(400).json({ message: "User already exists" });

//         // create user (role NOT from body)
//         const user = await UserModel.create({
//             firstName,
//             lastName,
//             email,
//             password,
//         });
//         const token = signToken({
//             payload: {
//                 _id: user._id,
//                 role: user.role
//             }
//         });

//         res.status(201).json({
//             message: "User registered successfully",
//             token,
//             user: {
//                 _id: user._id,
//                 firstName: user.firstName,
//                 lastName: user.lastName,
//                 email: user.email,
//                 role: user.role
//             }
//         });

//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };

export const login = async (req, res, next) => {
  const { email, password } = req.body
  const user = await dbService.findOne({ model: UserModel, filter: { email } })
  if (!user) {
    return next(new Error("user not Founded", { cause: 404 }))
  }

  const isPasswordMatch = await bcrypt.compare(password, user.password)
  if (!isPasswordMatch) {
    return next(new Error("Invalid password", { cause: 400 }));
  }

  // 1. أضف الـ role داخل الـ payload هنا لكي يراه الميدل وير لاحقاً
  const accessToken = signToken({
    payload: { _id: user._id, role: user.role }, // التعديل هنا
    options: {
      expiresIn: "1d",
      issuer: "Sakanly",
      subject: "Authentication",
    }
  })

  const refreshToken = signToken({
    payload: { _id: user._id, role: user.role }, // التعديل هنا
    options: {
      expiresIn: "7d",
      issuer: "Sakanly",
      subject: "Authentication",
    }
  })

  // ... إعدادات الـ cookies (تظل كما هي)

  // 2. أضف الـ role في الرد لكي يراه الفرونت إند فوراً عند تسجيل الدخول
  return successResponse({
    res,
    statusCode: 200,
    message: "Login Successfully",
    data: {
      accessToken,
      refreshToken,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName
    }
  })
}



