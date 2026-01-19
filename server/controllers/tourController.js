import Tour from "../models/Tour.js";

// Get all tours
export const getTours = async (req, res) => {
  try {
    // Fetch all tours, sorted by newest first
    const tours = await Tour.find().sort({ createdAt: -1 });

    // Optional: Log success for debugging
    console.log(
      `✅ Sent ${tours.length} tours to user: ${req.user?.email || "Guest"}`
    );

    res.status(200).json(tours);
  } catch (err) {
    console.error("❌ Get Tours Error:", err);
    res.status(500).json({ message: "Failed to fetch tours" });
  }
};

// Get single tour by ID (Useful for details page later)
export const getSingleTour = async (req, res) => {
  const id = req.params.id;
  try {
    const tour = await Tour.findById(id);
    if (!tour) {
      return res.status(404).json({ message: "Tour not found" });
    }
    res.status(200).json(tour);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch tour" });
  }
};
