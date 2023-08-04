import { RequestHandler } from "express";
import { errorException } from "../EXCEPTIONS/errorException";
import {IUser} from "../MODELS/user";
import { Secret, SignCallback } from "jsonwebtoken";
import { Hash } from "crypto";
 

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

require("dotenv").config;
const USER = require("../MODELS/user");

interface reqBody{
  username :string , email : string , password :string
}
const signup : RequestHandler = async (req, res, next) => {
  const { username , email , password} : reqBody  = req.body ;

  if (!username || !email || !password) {
    const error = new Error("Please fill all the feilds") as errorException;
    error.code = 400;
    return next(error);
  }

  let userNameExists : IUser | null;
  try {
    userNameExists  = await USER.findOne({ username: username });
  } catch {
    const error = new Error("internal Server Error , something went wrong") as errorException;
    error.code = 500;
    return next(error);
  }

  if (userNameExists) {
    const error = new Error("Username already taken") as errorException;
    error.code = 400;
    return next(error);
  }

  let emailExists : IUser| null;
  try {
    emailExists  = await USER.findOne({ email: email });

  } catch {
    const error = new Error("internal Server Error , something went wrong") as errorException;
    error.code = 500;
    return next(error);
  }

  if (emailExists) {
    const error = new Error("Email already taken") as errorException;
    error.code = 400;
    return next(error);
  }

  let hashedPassword: string;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    const error = new Error("internal Server Error , something went wrong") as errorException;
    error.code = 500;
    return next(error);
  }

  const user : IUser   = new USER({
    username : username ,
    email : email ,
   password : hashedPassword,
  });
 
  

  try {
    await user.save();
  } catch (err) {
    const error = new Error("internal Server Error , something went wrong") as errorException;
    error.code = 500;
    return next(error);
  }

  res.status(201).json({
    message: "Account created successfully , you can now go and login!",
  });
};

const login :RequestHandler = async (req, res, next) => {
  const { email , password} : Partial<reqBody> = req.body;

  let emailExists : IUser | null;
  try {
    emailExists = await USER.findOne({ email: email });
  } catch (err) {
    const error = new Error("ERROR CONNECTING TO SERVER , EMAIL") as errorException;
    error.code = 500;
    return next(error);
  }

  if (!emailExists) {
    const error = new Error("NO SUCH USER EXISTS ON THIS APP") as errorException;
    error.code = 401;
    return next(error);
  }

  let comparePassword : boolean;
  try {
    comparePassword  = await bcrypt.compare(password, emailExists.password);
  } catch (err) {
    const error = new Error("ERROR CONNECTING TO SERVER , PASSWORD") as errorException;
    error.code = 500;
    return next(error);
  }

  if (comparePassword !== true) {
    const error = new Error("PASSWORD IS WRONG") as errorException;
    error.code = 401;
    return next(error);
  }



  const refreshToken : SignCallback = jwt.sign(
    {
      userId: emailExists.id,
      email: emailExists.email,
      username: emailExists.username,
    },
    process.env.JWT_KEY as Secret,
    {
      expiresIn: "7d",
    },
  );

  res.cookie("jwtkicookie", refreshToken, {
    httpOnly: true,
    secure: true,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  });

  const token : SignCallback = jwt.sign(
    {
      username: emailExists.username,
      userId: emailExists.id,
      email: emailExists.email,
    },
    process.env.JWT_KEY,
    { expiresIn: "30m" },
  );

  res.status(201).json({
    email: emailExists.email,
    username: emailExists.username,
    userId: emailExists.id,
    token: token,
  });
};

const getUsers : RequestHandler = async (req, res, next) => {
  const userId = req.extractedUserId;

  let user  : IUser;
  try {
    user = await USER.findById(userId);
  } catch (err) {
    const error = new Error("ERROR CONNECTING TO SERVER , PASSWORD") as errorException;
    error.code = 500;
    return next(error);
  }

  if (!user) {
    const error = new Error("User not authorized")  as errorException;
    error.code = 409;
    return next(error);
  }

  let users : IUser[] | [];
  try {
    users = await USER.find({});
  } catch (err) {
    const error = new Error("ERROR CONNECTING TO SERVER , PASSWORD")  as errorException;
    error.code = 500;
    return next(error);
  }

  res
    .status(200)
    .json({ users: users.map((user : {toObject : Function}) => user.toObject({ getters: true })) });
};

const getRefreshToken : RequestHandler = async (req, res, next) => {
  let refreshToken;
  try {
    refreshToken = req.cookies.jwtkicookie;

    if (!refreshToken) {
      const error = new Error("Your session has expired!")  as errorException;
      error.code = 409;
      return next(error);
    }
  } catch (err) {
    const error = new Error("ERROR CONNECTING TO SERVER , PASSWORD")  as errorException;
    error.code = 500;
    return next(error);
  }

  let extractedToken : {username:string , email :string , userId : string};
  try {
    extractedToken = jwt.verify(refreshToken, process.env.JWT_KEY);
  } catch (err) {
    const error = new Error("ERROR CONNECTING TO SERVER , PASSWORD")  as errorException;
    error.code = 500;
    return next(error);
  }

  const un = extractedToken.username;
  const em = extractedToken.email;
  const id = extractedToken.userId;

  const token : SignCallback = jwt.sign(
    {
      username: un,
      userId: id,
      email: em,
    },

    process.env.JWT_KEY as Secret,
    { expiresIn: "30m" },
  );

  res.status(200).json({ username: un, email: em, userId: id, token: token });
};

const removeCookies : RequestHandler = async (req, res, next) => {
  res.clearCookie("jwtkicookie");
  res.status(200).json({ message: " User logged out!" });
};

exports.signup = signup;
exports.login = login;
exports.getUsers = getUsers;
exports.getRefreshToken = getRefreshToken;
exports.removeCookies = removeCookies;
