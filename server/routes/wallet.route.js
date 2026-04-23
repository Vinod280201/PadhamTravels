import express from "express";
import { WalletTransaction } from "../models/walletTransaction.model.js";

const router = express.Router();

// GET all wallet transactions
router.get("/transactions", async (req, res) => {
  try {
    const transactions = await WalletTransaction.find().sort({ date: -1 });
    console.log(`📡 GET /api/wallet/transactions - Found ${transactions.length} txs`);
    res.status(200).json({ status: true, transactions });
  } catch (error) {
    console.error("❌ Error /transactions:", error);
    res.status(500).json({ status: false, message: "Error fetching wallet transactions", error: error.message });
  }
});

// GET wallet balance
router.get("/balance", async (req, res) => {
  try {
    const result = await WalletTransaction.aggregate([
      {
        $group: {
          _id: null,
          total: {
            $sum: {
              $cond: [{ $eq: [{ $toUpper: "$type" }, "CREDIT"] }, "$amount", { $subtract: [0, "$amount"] }],
            },
          },
        },
      },
    ]);

    const balance = result.length > 0 ? result[0].total : 0;
    console.log(`📡 GET /api/wallet/balance - Calculated balance: ${balance}`);
    res.status(200).json({ status: true, balance });
  } catch (error) {
    console.error("❌ Error /balance:", error);
    res.status(500).json({ status: false, message: "Error calculating wallet balance", error: error.message });
  }
});

export default router;
