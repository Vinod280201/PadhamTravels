import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Booking } from './models/booking.model.js';
import { WalletTransaction } from './models/walletTransaction.model.js';

dotenv.config();

async function repair() {
    try {
        await mongoose.connect(process.env.MONGODB_CONN);
        console.log("Connected to MongoDB");

        const ref = "EMT27034S249Q";
        const amt = "4101.80";
        const comm = 309.06;

        const booking = await Booking.findOne({ bookingRef: ref });
        if (!booking) {
            console.log("Booking not found!");
            process.exit(0);
        }

        // 1. Update Booking
        booking.amount = amt;
        booking.commissionAmount = comm;
        await booking.save();
        console.log(`Updated booking ${ref} with Amount: ${amt}, Comm: ${comm}`);

        // 2. Add Wallet Transaction
        const existingTx = await WalletTransaction.findOne({ bookingRef: ref });
        if (!existingTx) {
            const tx = new WalletTransaction({
                amount: comm,
                type: 'CREDIT',
                description: `Commission from flight booking (MAA-BOM) - ${ref}`,
                bookingRef: ref,
                date: booking.createdAt || new Date()
            });
            await tx.save();
            console.log(`Added wallet transaction for ${ref}`);
        } else {
            console.log(`Transaction already exists for ${ref}`);
        }

        console.log("Repair finished successfully!");
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

repair();
