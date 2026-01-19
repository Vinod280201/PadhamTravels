import express from "express";
// 👇 Verify these imports match your actual file structure
import {
  getAllTours,
  createTour,
  updateTour,
  deleteTour,
} from "../controllers/adminToursController.js";

// 👇 IMPORT YOUR MULTER UPLOAD MIDDLEWARE HERE
// (Check your folder structure: it might be "../middleware/upload.js" or "../utils/multer.js")
import upload from "../middlewares/upload.js";

const router = express.Router();

// ✅ 1. SETUP MULTER FOR MULTIPLE FILES
// This allows both 'image' and 'itinerary' files to be uploaded at once
const tourUploads = upload.fields([
  { name: "image", maxCount: 1 },
  { name: "itinerary", maxCount: 1 },
]);

// ✅ 2. DEFINE ROUTES
// Note: If your server.js uses app.use('/api/admin', router), these paths should just be '/tours'

// GET all tours
router.get("/tours", getAllTours);

// POST create new tour (Applies the Multiple File Upload middleware)
router.post("/tours", tourUploads, createTour);

// PUT update tour (Applies the Multiple File Upload middleware)
router.put("/tours/:id", tourUploads, updateTour);

// DELETE tour
router.delete("/tours/:id", deleteTour);

export default router;
