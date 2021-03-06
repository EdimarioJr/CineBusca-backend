import jwt from "jsonwebtoken";

const checkToken = (token) =>{
    let id = ''
    if (!token) return { message: "No token provided!", auth: false }
    let result = jwt.verify(token, process.env.SECRET_JWT, (err, decoded) => {
        if (err)
          return {
            message: "Authentication failed!",
            auth: false,
            err: err,
            id
          }
        return {
            message: "Authentication success!",
            auth: true,
            id: decoded.id
        }
      });
  return result
}

export default checkToken