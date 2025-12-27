import express from "express";
import { searchFlights } from "../controllers/flights.controller.js";
import { authenticate } from "../middlewares/authenticate.js";

const router = express.Router();

// protect if you want login required; remove authenticate if it should be public
router.get("/search", authenticate, searchFlights);

export default router;
