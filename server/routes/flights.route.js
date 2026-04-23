import express from "express";
import { searchFlights, reviewFlight, bookFlight, fetchFlightTicket } from "../controllers/flights.controller.js";
import { authenticate } from "../middlewares/authenticate.js";

const router = express.Router();

// now its public; add "authenticate" if it should be protected
router.get("/search", searchFlights);
router.post("/review", reviewFlight);
router.post("/book", bookFlight);
router.post("/fetch-book", fetchFlightTicket);

export default router;
