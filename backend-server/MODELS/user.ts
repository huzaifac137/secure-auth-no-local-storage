import { Schema , Document } from "mongoose";

const mongoose = require("mongoose");

export interface IUser extends Document {
  username : string ,
  email : string ,
  password :string
}

const userSchema :Schema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
});

const userModal = mongoose.model("user", userSchema);
module.exports =userModal;
