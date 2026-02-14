import successResponse from "../../Utlis/successRespone.utlis.js"
import UserModel from "../../DB/models/user.model.js"
import * as dbService from "../../DB/dbServices.js"
import { signToken } from "../../Utlis/token.utlis.js"

export const signUP = async (req, res, next) => {
    const { firstName, lastName, password, email } = req.body
    const user = await dbService.findOne({ model: UserModel, filter: { email } })
    if (user) {
        return next(new Error("Email already exists", { cause: 409 }))
    }
    const createUser = await dbService.create({ model: UserModel, data: [{ firstName, lastName, password, email }] })
    return successResponse({ res, statusCode: 201, message: "User Create Successfully", data: createUser })
}

// register
// @route 
export const registerUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password} = req.body;

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
      firstName,
      lastName,
      email,
      password,
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};




