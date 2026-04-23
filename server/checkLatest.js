import mongoose from "mongoose";
import dotenv from "dotenv";
import { Booking } from "./models/booking.model.js";

dotenv.config();

async function check() {
  await mongoose.connect(process.env.MONGODB_CONN);
  const bookings = await Booking.find().sort({ createdAt: -1 }).limit(5).lean();
  console.log(JSON.stringify(bookings.map(b => ({
    ref: b.bookingRef,
    cust: b.customerName,
    email: b.email,
    amt: b.amount,
    comm: b.rawBookingData?.commissionAmount || 0,
    created: b.createdAt
  })), null, 2));
  process.exit(0);
}

check();
