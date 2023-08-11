import jwt from "jsonwebtoken";
import createError from "./error";

export const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token;

  if (!token) return next(createError(401, "Unauthorized!"));

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return next(createError(401, "Unauthorized!"));
    req.user = user;
    next();
  });
};
