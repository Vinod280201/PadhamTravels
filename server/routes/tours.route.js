import express from "express";
import { authenticate } from "../middlewares/authenticate.js";
import { getSingleTour, getTours } from "../controllers/tourController.js";

const router = express.Router();

// GET all tours
// Currently protected by 'authenticate'.
// If you want this to be PUBLIC (viewable without login), remove 'authenticate'.
router.get("/", authenticate, getTours);

// GET single tour (e.g. /api/tours/65a1b2c...)
router.get("/:id", authenticate, getSingleTour);

export default router;
