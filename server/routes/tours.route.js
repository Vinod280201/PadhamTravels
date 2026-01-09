import express from "express";
import { authenticate } from "../middlewares/authenticate.js";

const router = express.Router();

let tours = [];

// 👇 LOGIN REQUIRED (no admin middleware!)
router.get("/", authenticate, (req, res) => {
  console.log("GET /api/tours - AUTH USER OK:", req.user?.email);
  res.json(tours);
});

export default router;
