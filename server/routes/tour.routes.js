import express from "express";
import {
  getAllTours,
  getTourById,
  createTour,
  updateTour,
  deleteTour,
} from "../controllers/tour.controller.js";
import { verifyToken, requireAdmin } from "../middlewares/auth.middleware.js";
import upload from "../middlewares/upload.middleware.js";

const router = express.Router();

// Support multiple upload fields or array of images & itinerary
const tourUploads = upload.any();

// Public
router.get("/", getAllTours);
router.get("/:id", getTourById);

// Admin Protected
router.post("/", verifyToken, requireAdmin, tourUploads, createTour);
router.put("/:id", verifyToken, requireAdmin, tourUploads, updateTour);
router.delete("/:id", verifyToken, requireAdmin, deleteTour);

export default router;
