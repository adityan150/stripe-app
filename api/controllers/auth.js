import prisma from "./prisma.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { createError } from "../utils/error.js";
import isValidEmail from "../utils/validateEmail.js";

export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // validate email
    const emailIsValid = isValidEmail(email);
    if (!emailIsValid) throw createError(400, "Invalid email address!");

    // check if email is already registered
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (user) throw createError(400, "Email already registered!");

    // hash password
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    // create user
    const newUser = await prisma.user.create({
      data: {
        name: name,
        email: email,
        password: hash,
      },
    });

    res.status(201).json({ success: true, user: { name: name, email: email } });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // check if email is already registered
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!user) createError(404, "User not found!");

    // compare password
    const isMatch = bcrypt.compareSync(password, user.password);

    if (!isMatch) createError(400, "Incorrect email or password!");

    // create jwt token
    const token = jwt.sign(
      { id: user.id, name: user.name, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // send token in cookie
    res
      .cookie("access_token", token, {
        httpOnly: true,
        sameSite: "strict",
        maxAge: 1000 * 60 * 60 * 24,
        path: "/api",
      })
      .status(200)
      .json({ success: true, user: { name: user.name, email: user.email } });
  } catch (error) {
    next(error);
  }
};
