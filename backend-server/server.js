const express = require("express");
require("dotenv").config();

const cors = require("cors");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

const userRoutes = require("./ROUTES/userRoutes");
const { default: mongoose } = require("mongoose");

app.use("/api/users", userRoutes);

app.use((req, res, next) => {
  res.status(404).json({ message: " NO ROUTE FOUND" });
});

app.use((err, req, res, next) => {
  if (res.headerSent) {
    return next(err);
  }

  res.status(err.code || 500);
  res.json({ message: err.message || "SOMETHING WENT WRONG" });
});

try {
  mongoose.connect(process.env.MONGO_URL);
  console.log("DATABASE CONNECTED");
  app.listen(process.env.PORT, () => {
    console.log(`LISTENING TO PORT ${process.env.PORT}`);
  });
} catch (err) {
  console.log(err);
}
