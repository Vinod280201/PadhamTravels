import dotenv from "dotenv";
import mongoose from "mongoose";
import { Booking } from "./models/booking.model.js";

dotenv.config();

const fixDates = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_CONN);
    console.log("Connected to MongoDB.");

    const result = await Booking.updateMany(
      {},
      { $set: { travelDate: new Date("2026-02-28T12:00:00Z") } }
    );

    console.log(`Updated ${result.modifiedCount} bookings correctly to 28th Feb!`);
  } catch (error) {
    console.error("Error fixing dates:", error);
  } finally {
    process.exit(0);
  }
};

fixDates();
