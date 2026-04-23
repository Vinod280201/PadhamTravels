import express from "express";
import FlightDeal from "../models/FlightDeal.js";

const router = express.Router();

// @desc    Get all deals
// @route   GET /api/deals
// @access  Public
router.get("/", async (req, res) => {
  try {
    const deals = await FlightDeal.find({}).sort({ createdAt: -1 }); // Newest first
    res.json(deals);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

// @desc    Create a deal
// @route   POST /api/deals
// @access  Private (Admin only)
router.post("/", async (req, res) => {
  const { origin, destination, type, dealName, date, price, alert, validity } =
    req.body;

  if (!origin || !destination || !price) {
    return res.status(400).json({ message: "Please fill required fields" });
  }

  try {
    const deal = new FlightDeal({
      origin,
      destination,
      type,
      dealName,
      date,
      price,
      alert,
      validity,
    });

    const createdDeal = await deal.save();
    res.status(201).json(createdDeal);
  } catch (error) {
    res.status(400).json({ message: "Invalid deal data" });
  }
});

// @desc    Update a deal
// @route   PUT /api/deals/:id
// @access  Private (Admin only)
router.put("/:id", async (req, res) => {
  const { origin, destination, type, dealName, date, price, alert, validity } =
    req.body;

  try {
    const deal = await FlightDeal.findById(req.params.id);

    if (deal) {
      deal.origin = origin || deal.origin;
      deal.destination = destination || deal.destination;
      deal.type = type || deal.type;
      deal.dealName = dealName || deal.dealName;
      deal.date = date || deal.date;
      deal.price = price || deal.price;
      deal.alert = alert || deal.alert; // Allow empty string updates if needed
      deal.validity = validity || deal.validity;

      const updatedDeal = await deal.save();
      res.json(updatedDeal);
    } else {
      res.status(404).json({ message: "Deal not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

// @desc    Delete a deal
// @route   DELETE /api/deals/:id
// @access  Private (Admin only)
router.delete("/:id", async (req, res) => {
  try {
    const deal = await FlightDeal.findById(req.params.id);

    if (deal) {
      await deal.deleteOne();
      res.json({ message: "Deal removed" });
    } else {
      res.status(404).json({ message: "Deal not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

export default router;
