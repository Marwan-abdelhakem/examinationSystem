import { verifyTokin } from "../Utlis/token.utlis.js"
import * as dbService from "../DB/dbServices.js"
import UserModel from "../DB/models/user.model.js"

// export const authentication = async (req, res, next) => {
//     const { authorization } = req.headers
//     const decoded = verifyTokin({ token: authorization })

//     const user = await dbService.findById({ model: UserModel, id: { _id: decoded._id } })

//     if (!user) {
//         return next(new Error("User Not Founded", { cause: 409 }))
//     }
//     req.user = user
//     return next()
// }

// داخل ملف auth.middlewares.js
export const authentication = async (req, res, next) => {
    // جلب التوكن من الكوكيز (للمتصفح) أو من الـ Header (للمبرمجين/Postman)
    const token = req.cookies.accessToken || req.headers.authorization;

    if (!token) {
        return next(new Error("Token required, please login", { cause: 401 }));
    }

    try {
        const decoded = verifyTokin({ token });

        // ملاحظة: بما أنك أضفت الـ role في التوكن سابقاً، يمكنك استخدامه هنا مباشرة
        const user = await dbService.findById({
            model: UserModel,
            id: decoded._id
        });

        if (!user) {
            return next(new Error("User Not Found", { cause: 404 }));
        }

        req.user = user;
        next();
    } catch (error) {
        return next(new Error("Invalid or expired token", { cause: 401 }));
    }
}


export const authorization = ({ role = [] }) => {
    return async (req, res, next) => {
        if (!role.includes(req.user.role)) {
            return next(new Error("Unauthorized", { cause: 403 }))
        }
        return next()
    }
}