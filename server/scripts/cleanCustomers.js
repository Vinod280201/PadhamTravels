import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, "../.env") });

// Import Models
import User from "../models/user.model.js";
import Inquiry from "../models/Inquiry.js";

const cleanDatabase = async () => {
  try {
    const mongoUri = process.env.MONGODB_CONN || process.env.MONGO_URI || process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error("MONGODB_CONN / MONGO_URI is not defined in environment variables.");
    }

    console.log("Connecting to MongoDB...");
    await mongoose.connect(mongoUri);
    console.log("Connected successfully.");

    // 1. Identify and protect Admin account(s)
    const adminQuery = {
      $or: [
        { role: "admin" },
        { email: "admin@gmail.com" }
      ]
    };

    const adminAccounts = await User.find(adminQuery);
    console.log(`Found ${adminAccounts.length} Admin account(s):`);
    adminAccounts.forEach((adm) => console.log(` - ${adm.email} (${adm.role})`));

    if (adminAccounts.length === 0) {
      console.warn("WARNING: No admin account found! Aborting deletion to prevent lockout.");
      process.exit(1);
    }

    // 2. Remove all non-admin users
    const deleteUsersResult = await User.deleteMany({
      $and: [
        { role: { $ne: "admin" } },
        { email: { $ne: "admin@gmail.com" } }
      ]
    });
    console.log(`Successfully removed ${deleteUsersResult.deletedCount} non-admin customer account(s).`);

    // 3. Clear all test inquiries/leads
    const deleteInquiriesResult = await Inquiry.deleteMany({});
    console.log(`Successfully removed ${deleteInquiriesResult.deletedCount} test inquiry lead(s).`);

    // 4. Verify post-cleanup state
    const remainingUsers = await User.find({}, "name email role");
    console.log("\nRemaining User Accounts in Database:");
    console.table(remainingUsers.map((u) => ({ id: u._id.toString(), name: u.name, email: u.email, role: u.role })));

    console.log("\nDatabase cleanup complete. Customer count reset.");
    process.exit(0);
  } catch (error) {
    console.error("Error during database cleanup:", error);
    process.exit(1);
  }
};

cleanDatabase();
