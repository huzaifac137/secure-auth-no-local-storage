import { RequestHandler } from "express";
import { errorException } from "../../EXCEPTIONS/errorException";
import { JwtPayload } from "jsonwebtoken";

const jwt = require("jsonwebtoken");
require("dotenv").config();



const auth : RequestHandler = (req, res, next) => {
  let rawToken : string| JwtPayload = req.headers.authorization!;

  const token = rawToken?.split("mjfcmjbl")[1];

  let extractedToken : {userId : string};
  try {
    extractedToken = jwt.verify(token, process.env.JWT_KEY);
  } catch (err) {
    const error = new Error("SOMETHING WENT WRONG ") as errorException;
    console.log(err);
    error.code = 500;
    return next(error);
  }

  console.log("AUTHENTICATED");

  req.extractedUserId = extractedToken.userId;

  next();
};

module.exports = auth;
