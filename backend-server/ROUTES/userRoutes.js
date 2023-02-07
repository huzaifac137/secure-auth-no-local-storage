const express = require("express");
const auth = require("../CONTROLLERS/AUTH/auth");
const {
  login,
  signup,
  getUsers,
  getRefreshToken,
} = require("../CONTROLLERS/userController");
const router = express.Router();

router.get("/token/refresh", getRefreshToken);
router.post("/login", login);
router.post("/signup", signup);
router.get("/", auth, getUsers);
module.exports = router;
