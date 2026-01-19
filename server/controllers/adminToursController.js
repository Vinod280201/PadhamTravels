import Tour from "../models/Tour.js";

export const getAllTours = async (req, res) => {
  try {
    const tours = await Tour.find().sort({ createdAt: -1 });
    res.status(200).json(tours);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch tours" });
  }
};

export const createTour = async (req, res) => {
  try {
    const tourData = { ...req.body };

    // 1. Handle Image Upload
    // req.files['image'] is an array, we take the first file [0]
    if (req.files && req.files.image) {
      tourData.image = `/uploads/${req.files.image[0].filename}`;
    } else {
      tourData.image = ""; // Or handle default image logic
    }

    // 2. Handle Itinerary PDF Upload
    // req.files['itinerary'] is an array, we take the first file [0]
    if (req.files && req.files.itinerary) {
      tourData.itinerary = `/uploads/${req.files.itinerary[0].filename}`;
    } else {
      tourData.itinerary = ""; // Default empty if not provided
    }

    // 3. Process Highlights (Convert comma-separated string to Array)
    if (tourData.highlights && typeof tourData.highlights === "string") {
      tourData.highlights = tourData.highlights
        .split(",")
        .map((h) => h.trim())
        .filter(Boolean); // Removes empty strings
    } else if (!tourData.highlights) {
      tourData.highlights = [];
    }

    const newTour = new Tour(tourData);
    const savedTour = await newTour.save();
    res.status(201).json(savedTour);
  } catch (err) {
    console.error("Create Tour Error:", err);
    res.status(500).json({ message: "Failed to create tour" });
  }
};

export const updateTour = async (req, res) => {
  try {
    let updateData = { ...req.body };

    // 1. Check if a new IMAGE was uploaded
    if (req.files && req.files.image) {
      updateData.image = `/uploads/${req.files.image[0].filename}`;
    }

    // 2. Check if a new ITINERARY PDF was uploaded
    if (req.files && req.files.itinerary) {
      updateData.itinerary = `/uploads/${req.files.itinerary[0].filename}`;
    }

    // 3. Process Highlights
    if (typeof updateData.highlights === "string") {
      updateData.highlights = updateData.highlights
        .split(",")
        .map((h) => h.trim())
        .filter(Boolean);
    }

    const updatedTour = await Tour.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true }
    );
    res.status(200).json(updatedTour);
  } catch (err) {
    console.error("Update Error:", err);
    res.status(500).json({ message: "Failed to update tour" });
  }
};

export const deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Tour deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete tour" });
  }
};
