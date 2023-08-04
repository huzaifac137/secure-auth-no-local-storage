import { Router } from "express";

const express = require("express");
const auth = require("../CONTROLLERS/AUTH/auth");
const {
  login,
  signup,
  getUsers,
  getRefreshToken,
  removeCookies,
} = require("../CONTROLLERS/userController");
const router : Router = express.Router();

router.get("/token/refresh", getRefreshToken);
router.get("/cookies/remove", removeCookies);
router.post("/login", login);
router.post("/signup", signup);
router.get("/", auth, getUsers);
module.exports = router;
