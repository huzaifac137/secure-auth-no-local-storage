"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config;
const USER = require("../MODELS/user");
const signup = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        const error = new Error("Please fill all the feilds");
        error.code = 400;
        return next(error);
    }
    let userNameExists;
    try {
        userNameExists = yield USER.findOne({ username: username });
    }
    catch (_a) {
        const error = new Error("internal Server Error , something went wrong");
        error.code = 500;
        return next(error);
    }
    if (userNameExists) {
        const error = new Error("Username already taken");
        error.code = 400;
        return next(error);
    }
    let emailExists;
    try {
        emailExists = yield USER.findOne({ email: email });
    }
    catch (_b) {
        const error = new Error("internal Server Error , something went wrong");
        error.code = 500;
        return next(error);
    }
    if (emailExists) {
        const error = new Error("Email already taken");
        error.code = 400;
        return next(error);
    }
    let hashedPassword;
    try {
        hashedPassword = yield bcrypt.hash(password, 12);
    }
    catch (err) {
        const error = new Error("internal Server Error , something went wrong");
        error.code = 500;
        return next(error);
    }
    const user = new USER({
        username: username,
        email: email,
        password: hashedPassword,
    });
    try {
        yield user.save();
    }
    catch (err) {
        const error = new Error("internal Server Error , something went wrong");
        error.code = 500;
        return next(error);
    }
    res.status(201).json({
        message: "Account created successfully , you can now go and login!",
    });
});
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    let emailExists;
    try {
        emailExists = yield USER.findOne({ email: email });
    }
    catch (err) {
        const error = new Error("ERROR CONNECTING TO SERVER , EMAIL");
        error.code = 500;
        return next(error);
    }
    if (!emailExists) {
        const error = new Error("NO SUCH USER EXISTS ON THIS APP");
        error.code = 401;
        return next(error);
    }
    let comparePassword;
    try {
        comparePassword = yield bcrypt.compare(password, emailExists.password);
    }
    catch (err) {
        const error = new Error("ERROR CONNECTING TO SERVER , PASSWORD");
        error.code = 500;
        return next(error);
    }
    if (comparePassword !== true) {
        const error = new Error("PASSWORD IS WRONG");
        error.code = 401;
        return next(error);
    }
    const refreshToken = jwt.sign({
        userId: emailExists.id,
        email: emailExists.email,
        username: emailExists.username,
    }, process.env.JWT_KEY, {
        expiresIn: "7d",
    });
    res.cookie("jwtkicookie", refreshToken, {
        httpOnly: true,
        secure: true,
        maxAge: 1000 * 60 * 60 * 24 * 7,
    });
    const token = jwt.sign({
        username: emailExists.username,
        userId: emailExists.id,
        email: emailExists.email,
    }, process.env.JWT_KEY, { expiresIn: "30m" });
    res.status(201).json({
        email: emailExists.email,
        username: emailExists.username,
        userId: emailExists.id,
        token: token,
    });
});
const getUsers = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.extractedUserId;
    let user;
    try {
        user = yield USER.findById(userId);
    }
    catch (err) {
        const error = new Error("ERROR CONNECTING TO SERVER , PASSWORD");
        error.code = 500;
        return next(error);
    }
    if (!user) {
        const error = new Error("User not authorized");
        error.code = 409;
        return next(error);
    }
    let users;
    try {
        users = yield USER.find({});
    }
    catch (err) {
        const error = new Error("ERROR CONNECTING TO SERVER , PASSWORD");
        error.code = 500;
        return next(error);
    }
    res
        .status(200)
        .json({ users: users.map((user) => user.toObject({ getters: true })) });
});
const getRefreshToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let refreshToken;
    try {
        refreshToken = req.cookies.jwtkicookie;
        if (!refreshToken) {
            const error = new Error("Your session has expired!");
            error.code = 409;
            return next(error);
        }
    }
    catch (err) {
        const error = new Error("ERROR CONNECTING TO SERVER , PASSWORD");
        error.code = 500;
        return next(error);
    }
    let extractedToken;
    try {
        extractedToken = jwt.verify(refreshToken, process.env.JWT_KEY);
    }
    catch (err) {
        const error = new Error("ERROR CONNECTING TO SERVER , PASSWORD");
        error.code = 500;
        return next(error);
    }
    const un = extractedToken.username;
    const em = extractedToken.email;
    const id = extractedToken.userId;
    const token = jwt.sign({
        username: un,
        userId: id,
        email: em,
    }, process.env.JWT_KEY, { expiresIn: "30m" });
    res.status(200).json({ username: un, email: em, userId: id, token: token });
});
const removeCookies = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    res.clearCookie("jwtkicookie");
    res.status(200).json({ message: " User logged out!" });
});
exports.signup = signup;
exports.login = login;
exports.getUsers = getUsers;
exports.getRefreshToken = getRefreshToken;
exports.removeCookies = removeCookies;
