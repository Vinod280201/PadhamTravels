import mongoose from "mongoose";
import dotenv from "dotenv";
import { Booking } from "./models/booking.model.js";
import { WalletTransaction } from "./models/walletTransaction.model.js";
import User from "./models/user.model.js";

dotenv.config();

async function repairBookings() {
  try {
    await mongoose.connect(process.env.MONGODB_CONN);
    console.log("✅ connected to DB");

    const bookings = await Booking.find().lean();
    console.log(`Checking ${bookings.length} bookings...`);

    let updatedCount = 0;
    let walletSynced = 0;

    for (const b of bookings) {
      const bookData = b.rawBookingData || {};
      const amount = bookData.totalFare?.TF || bookData.totalFare?.totalFare || bookData.TF || bookData.amount || 0;
      const commission = bookData.totalFare?.CMSN || bookData.priceResponse?.commissionAmount || bookData.commissionAmount || b.rawBookingData?.commissionAmount || 0;

      const needsAmountFix = b.amount === "Available via API" || !b.amount;
      const needsCommissionFix = (b.rawBookingData && !b.rawBookingData.commissionAmount && commission > 0);

      if (needsAmountFix || needsCommissionFix) {
        await Booking.updateOne(
          { _id: b._id },
          { 
            $set: { 
              amount: amount.toString(),
              "rawBookingData.commissionAmount": commission
            } 
          }
        );
        updatedCount++;
      }

      // Sync to Wallet if it's a User booking
      if (commission > 0) {
        const user = await User.findOne({ email: new RegExp(`^\\s*${b.email}\\s*$`, "i"), role: "user" }).lean();
        if (user) {
          const existingTx = await WalletTransaction.findOne({ bookingRef: b.bookingRef });
          if (!existingTx) {
            await WalletTransaction.create({
              amount: commission,
              type: "CREDIT",
              description: `Commission earned from user booking by ${b.customerName} (${b.email})`,
              bookingRef: b.bookingRef,
              date: b.createdAt || new Date()
            });
            walletSynced++;
          }
        }
      }
    }

    console.log(`✅ Repair complete. Bookings Updated: ${updatedCount}, Wallet Transactions Synced: ${walletSynced}`);
    process.exit(0);
  } catch (err) {
    console.error("❌ Repair failed:", err);
    process.exit(1);
  }
}

repairBookings();
