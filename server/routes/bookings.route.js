import express from "express";
import { 
  getAllBookings, 
  getUserBookings, 
  getDashboardStats, 
  requestCancellation, 
  adminProcessCancellation, 
  adminUpdatePnr,
  requestReschedule,
  adminProcessReschedule
} from "../controllers/bookings.controller.js";
import { requireAuth } from "../controllers/AuthController.js";

const router = express.Router();

// Currently public for development, can add authenticate later if needed
router.get("/", getAllBookings);

// Fetch logged-in user bookings
router.get("/my-bookings", requireAuth, getUserBookings);

// Fetch admin dashboard stats
router.get("/dashboard-stats", getDashboardStats);

// --- CANCELLATION ROUTES ---

// 1. Customer initiates request
router.post("/request-cancellation/:id", requireAuth, requestCancellation);

// 2. Admin processes cancellation (Accept/Reject)
router.post("/admin/process-cancellation/:id", requireAuth, adminProcessCancellation);

// --- RESCHEDULE ROUTES ---

// 1. Customer initiates reschedule request
router.post("/request-reschedule/:id", requireAuth, requestReschedule);

// 2. Admin processes reschedule (Accept/Reject)
router.post("/admin/process-reschedule/:id", requireAuth, adminProcessReschedule);

// --- MISC ADMIN ROUTES ---

// Admin updates airline PNR
router.post("/admin/update-pnr/:id", requireAuth, adminUpdatePnr);

export default router;
