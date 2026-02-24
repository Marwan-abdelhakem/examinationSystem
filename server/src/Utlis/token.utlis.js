// import jwt from "jsonwebtoken"

// export const signToken = ({ payload = {}, signature = "secret", options = {
//     expiresIn: "1d",
// } }) => {
//     return jwt.sign(payload, signature, options)
// }

// export const verifyToken = ({ token = "", signature = process.env.JWT_SECRET }) => {
//     return jwt.verify(token, signature)
// }
import jwt from "jsonwebtoken";

export const signToken = ({
  payload = {},
  options = { expiresIn: "1d" }
}) => {
  return jwt.sign(
    payload,
    process.env.JWT_SECRET,
    options
  );
};

export const verifyToken = ({ token }) => {
  return jwt.verify(
    token,
    process.env.JWT_SECRET
  );
};