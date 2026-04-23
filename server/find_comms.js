import mongoose from "mongoose";
import dotenv from "dotenv";
import { Booking } from "./models/booking.model.js";

dotenv.config();

async function findComms() {
  await mongoose.connect(process.env.MONGODB_CONN);
  const bookings = await Booking.find({ commissionAmount: { $gt: 0 } }).sort({ createdAt: -1 }).limit(5);
  console.log("BOOKINGS_WITH_COMMISSION:", JSON.stringify(bookings.map(b => ({ 
    ref: b.bookingRef, 
    comm: b.commissionAmount, 
    email: b.email,
    flight: b.flightDetails,
    date: b.createdAt
  })), null, 2));
  process.exit(0);
}

findComms();
