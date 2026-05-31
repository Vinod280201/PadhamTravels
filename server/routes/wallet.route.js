import express from "express";
import axios from "axios";
import { WalletTransaction } from "../models/walletTransaction.model.js";
import { getAgencyToken } from "../services/agencyService.js";

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

// GET live B2B agency provider balance
router.get("/agency-balance", async (req, res) => {
  try {
    const tokenId = await getAgencyToken();
    console.log(`📡 GET /api/wallet/agency-balance - Fetching live B2B balance...`);
    const response = await axios.post("http://apidev.webandapi.com/user/agencyBalance", {
      tokenId,
      companyCode: process.env.COMPANY_CODE || "EMT"
    });

    if (response.data && response.data.resCode === "200") {
      res.status(200).json({ status: true, balance: response.data.total });
    } else {
      console.error("❌ B2B balance fetch error:", response.data);
      res.status(400).json({ status: false, message: response.data.resMessage || "Failed to fetch B2B balance" });
    }
  } catch (error) {
    console.error("❌ Error fetching agency balance:", error.message);
    res.status(500).json({ status: false, message: "Error calculating B2B agency balance", error: error.message });
  }
});

export default router;
