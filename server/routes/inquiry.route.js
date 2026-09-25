import express from "express";
import {
  createInquiry,
  getInquiries,
  updateInquiryStatus,
  deleteInquiry,
} from "../controllers/inquiry.controller.js";

const router = express.Router();

// Public: Submit inquiry
router.post("/", createInquiry);

// Admin: Manage inquiries
router.get("/", getInquiries);
router.patch("/:id", updateInquiryStatus);
router.delete("/:id", deleteInquiry);

export default router;
