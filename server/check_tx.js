import mongoose from "mongoose";
import dotenv from "dotenv";
import { WalletTransaction } from "./models/walletTransaction.model.js";

dotenv.config();

async function checkTx() {
  await mongoose.connect(process.env.MONGODB_CONN);
  const tx = await WalletTransaction.findOne({ bookingRef: "EMT3103M43Q9O" });
  console.log("WALLET_TX:", JSON.stringify(tx, null, 2));
  process.exit(0);
}

checkTx();
