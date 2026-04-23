import mongoose from "mongoose";
import dotenv from "dotenv";
import { Booking } from "./models/booking.model.js";
import { WalletTransaction } from "./models/walletTransaction.model.js";
import User from "./models/user.model.js";

dotenv.config();

async function fixLatest() {
  await mongoose.connect(process.env.MONGODB_CONN);
  
  // Specific fix for the booking the user just made
  const bookRef = "EMT2703OQU494";
  const fare = 8168;
  const comm = 733.23;

  const result = await Booking.updateOne(
    { bookingRef: bookRef },
    { 
      $set: { 
        amount: fare.toString(),
        "rawBookingData.commissionAmount": comm 
      } 
    }
  );

  console.log(`✅ Updated Booking ${bookRef}:`, result.modifiedCount);

  // Re-sync wallet for this specific one
  const b = await Booking.findOne({ bookingRef: bookRef }).lean();
  if (b) {
      const user = await User.findOne({ email: new RegExp(`^\\s*${b.email}\\s*$`, "i"), role: "user" }).lean();
      if (user) {
          const existingTx = await WalletTransaction.findOne({ bookingRef: bookRef });
          if (!existingTx) {
              await WalletTransaction.create({
                  amount: comm,
                  type: "CREDIT",
                  description: `Commission earned from user booking by ${b.customerName} (${b.email})`,
                  bookingRef: b.bookingRef,
                  date: b.createdAt || new Date()
              });
              console.log("✅ Wallet also synced for this booking.");
          } else {
              console.log("ℹ️ Wallet already has a transaction for this reference.");
          }
      }
  }

  process.exit(0);
}

fixLatest();
