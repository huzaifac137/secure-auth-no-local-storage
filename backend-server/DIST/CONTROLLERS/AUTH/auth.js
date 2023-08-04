"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jwt = require("jsonwebtoken");
require("dotenv").config();
const auth = (req, res, next) => {
    let rawToken = req.headers.authorization;
    const token = rawToken === null || rawToken === void 0 ? void 0 : rawToken.split("mjfcmjbl")[1];
    let extractedToken;
    try {
        extractedToken = jwt.verify(token, process.env.JWT_KEY);
    }
    catch (err) {
        const error = new Error("SOMETHING WENT WRONG ");
        console.log(err);
        error.code = 500;
        return next(error);
    }
    console.log("AUTHENTICATED");
    req.extractedUserId = extractedToken.userId;
    next();
};
module.exports = auth;
