import mongoose from "mongoose";
import dotenv from "dotenv";
import { Booking } from "./models/booking.model.js";

dotenv.config();

async function checkBooking() {
  await mongoose.connect(process.env.MONGODB_CONN);
  const booking = await Booking.findOne({ bookingRef: "EMT3103M43Q9O" });
  console.log("BOOKING:", JSON.stringify(booking, null, 2));
  process.exit(0);
}

checkBooking();
