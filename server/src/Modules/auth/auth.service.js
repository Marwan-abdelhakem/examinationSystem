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





