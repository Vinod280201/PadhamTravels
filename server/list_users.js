import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/user.model.js";

dotenv.config();

async function findUsers() {
  await mongoose.connect(process.env.MONGODB_CONN);
  const users = await User.find({ role: "user" }).limit(3);
  const admins = await User.find({ role: "admin" }).limit(3);
  
  console.log("--- Registered Users ---");
  console.log(JSON.stringify(users, null, 2));
  
  console.log("--- Admins ---");
  console.log(JSON.stringify(admins, null, 2));
  
  process.exit(0);
}

findUsers();
