import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/user.model.js";

dotenv.config();

async function checkUser() {
  await mongoose.connect(process.env.MONGODB_CONN);
  const user = await User.findOne({ email: "test1@gmail.com" });
  console.log("USER:", JSON.stringify(user, null, 2));
  process.exit(0);
}

checkUser();
