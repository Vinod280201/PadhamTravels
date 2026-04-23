import express from "express";
import { authenticate } from "../middlewares/authenticate.js";
import { getSingleTour, getTours } from "../controllers/tourController.js";

const router = express.Router();

// GET all tours
// Currently its PUBLIC.
// If you want this to be PROTECTED (viewable without login), add 'authenticate'.
router.get("/", getTours);

// GET single tour (e.g. /api/tours/65a1b2c...)
router.get("/:id", getSingleTour);

export default router;
