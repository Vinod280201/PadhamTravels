import express from "express";
import { authenticate } from "../middlewares/authenticate.js";
import { authorizeAdmin } from "../middlewares/adminAuthenticate.js";

const router = express.Router();

// 👇 ADMIN-ONLY: Full CRUD
router.use(authenticate, authorizeAdmin);

router.get("/", (req, res) => {
  console.log("GET /api/admin/tours - ADMIN");
  res.json(tours);
});

// POST /api/tours - create a new tour
router.post("/", (req, res) => {
  console.log("POST /api/tours hit with body:", req.body);
  try {
    const {
      name,
      destination,
      duration,
      price,
      rating = 0,
      reviews = 0,
      available = 0,
      highlights = [],
      image = "",
    } = req.body || {};

    if (!name || !destination || !price) {
      return res.status(400).json({
        message: "name, destination and price are required",
      });
    }

    const newTour = {
      id: `TR${String(tours.length + 1).padStart(3, "0")}`, // simple id
      name,
      destination,
      duration,
      price,
      rating,
      reviews,
      available,
      highlights,
      image,
      createdAt: new Date().toISOString(),
    };

    tours.push(newTour);

    return res.status(201).json(newTour);
  } catch (err) {
    console.error("CREATE TOUR ERROR", err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// PUT /api/tours/:id - update an existing tour
router.put("/:id", (req, res) => {
  const { id } = req.params;
  console.log("PUT /api/tours hit with id:", id, "body:", req.body);

  const index = tours.findIndex((t) => t.id === id || t._id === id);

  if (index === -1) {
    return res.status(404).json({ message: "Tour not found" });
  }

  const existing = tours[index];

  const {
    name = existing.name,
    destination = existing.destination,
    duration = existing.duration,
    price = existing.price,
    rating = existing.rating,
    reviews = existing.reviews,
    available = existing.available,
    highlights = existing.highlights,
    image = existing.image,
  } = req.body || {};

  if (!name || !destination || !price) {
    return res
      .status(400)
      .json({ message: "name, destination and price are required" });
  }

  const updated = {
    ...existing,
    name,
    destination,
    duration,
    price,
    rating,
    reviews,
    available,
    highlights,
    image,
    updatedAt: new Date().toISOString(),
  };

  tours[index] = updated;

  return res.status(200).json(updated);
});

// DELETE /api/tours/:id - remove a tour by id
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  console.log("DELETE /api/tours hit with id:", id);

  const before = tours.length;
  tours = tours.filter((t) => t.id !== id && t._id !== id);

  if (tours.length === before) {
    console.log("Tour not found for id:", id);
    return res.status(404).json({ message: "Tour not found" });
  }

  console.log(
    "Tour deleted, remaining ids:",
    tours.map((t) => t.id)
  );
  return res.status(200).json({ message: "Tour deleted", id });
});

export default router;
