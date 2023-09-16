import { NextFunction , Request , Response , ErrorRequestHandler } from "express";
import { errorException } from "./EXCEPTIONS/errorException";
import { Mongoose } from "mongoose";

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
const mongoose  = require("mongoose");

app.use("/api/users", userRoutes);

app.use( (req : Request, res : Response, next : NextFunction)  => {
  res.status(404).json({ message: " NO ROUTE FOUND" });
});

app.use((err : unknown, req : Request, res : Response, next : NextFunction) => {
  if (res.headersSent) {
    return next(err);
  }

    res.status((err as errorException).code || 500);
    res.json({ message: (err as errorException).message || "SOMETHING WENT WRONG" });

});

try {
 
  mongoose.set('strictQuery', true);
  mongoose.connect(process.env.MONGO_URI) ;
  console.log(`DATABASE CONNECTED   on ${process.env.MONGO_URI} `);
  app.listen(process.env.PORT, () => {
    console.log(`LISTENING TO PORT ${process.env.PORT}`);
  });
} catch (err) {
  console.log(err);
}
