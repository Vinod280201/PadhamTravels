import mongoose from "mongoose";
import dotenv from "dotenv";
import { Booking } from "./models/booking.model.js";
import fs from "fs";

dotenv.config();

async function extractRaw() {
  await mongoose.connect(process.env.MONGODB_CONN);
  const booking = await Booking.findOne({ bookingRef: "EMT3103M43Q9O" });
  if (booking) {
    fs.writeFileSync("raw_booking_debug.json", JSON.stringify(booking.rawBookingData, null, 2), "utf8");
    console.log("Raw booking data saved to raw_booking_debug.json");
  } else {
    console.log("Booking not found");
  }
  process.exit(0);
}

extractRaw();
