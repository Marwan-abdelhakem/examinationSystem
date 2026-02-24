import { verifyToken } from "../Utlis/token.utlis.js"
import * as dbService from "../DB/dbServices.js"
import UserModel from "../DB/models/user.model.js"

// export const authentication = async (req, res, next) => {
//     const { authorization } = req.headers
//     const decoded = verifyToken({ token: authorization })

//     const user = await dbService.findById({ model: UserModel, id: { _id: decoded._id } })

//     if (!user) {
//         return next(new Error("User Not Founded", { cause: 409 }))
//     }
//     req.user = user
//     return next()
// }

export const authentication = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return next(new Error("No token provided", { cause: 401 }));
    }

    const token = authHeader.split(" ")[1];

    const decoded = verifyToken({ token });

    const user = await dbService.findById({
      model: UserModel,
      id: decoded._id
    });

    if (!user) {
      return next(new Error("User Not Found", { cause: 409 }));
    }

    req.user = user;

    next();

  } catch (error) {
    next(error);
  }
};

export const authorization = ({ role = [] }) => {
    return async (req, res, next) => {
        if (!role.includes(req.user.role)) {
            return next(new Error("Unauthorized", { cause: 403 }))
        }
        return next()
    }
}