import mongoose from "mongoose";

const walletTransactionSchema = new mongoose.Schema(
  {
    amount: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      enum: ["CREDIT", "DEBIT"],
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    bookingRef: {
      type: String,
      default: null,
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export const WalletTransaction = mongoose.model("WalletTransaction", walletTransactionSchema);
