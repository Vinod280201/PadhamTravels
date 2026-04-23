import mongoose from "mongoose";
import dotenv from "dotenv";
import { Booking } from "./models/booking.model.js";
import { WalletTransaction } from "./models/walletTransaction.model.js";

dotenv.config();

async function checkBooking() {
  await mongoose.connect(process.env.MONGODB_CONN);
  const ref = "EMT3003SD5Q9M";
  const booking = await Booking.findOne({ bookingRef: ref });
  const transaction = await WalletTransaction.findOne({ bookingRef: ref });

  console.log("--- Booking Info ---");
  console.log(JSON.stringify(booking, null, 2));
  console.log("--- Transaction Info ---");
  console.log(JSON.stringify(transaction, null, 2));

  process.exit(0);
}

checkBooking();
