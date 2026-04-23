import mongoose from "mongoose";
import dotenv from "dotenv";
import { Booking } from "./models/booking.model.js";

dotenv.config();

mongoose.connect(process.env.MONGODB_CONN).then(async () => {
    // Find a booking where rawBookingData.commissionAmount > 0
    const b = await Booking.findOne({
      "rawBookingData.commissionAmount": { $gt: 0 }
    });
    
    if (b) {
      console.log("Found Commission:", b.rawBookingData.commissionAmount);
    } else {
      console.log("No bookings have commission > 0.");
      // Just check what fields exist
      const any_b = await Booking.findOne({});
      console.log("Any booking info:", any_b ? Object.keys(any_b.rawBookingData) : "null");
      if (any_b && any_b.rawBookingData) {
          console.log("Any booking commission:", any_b.rawBookingData.commissionEarned, any_b.rawBookingData.commission);
      }
    }
    process.exit(0);
});
