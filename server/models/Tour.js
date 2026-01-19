import mongoose from "mongoose";

const tourSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    destination: { type: String, required: true },
    duration: { type: String, required: false },
    price: { type: String, required: true },
    rating: { type: Number, default: 0 },
    reviews: { type: Number, default: 0 },

    // REMOVED: available
    // ADDED: itinerary (stores the PDF link)
    itinerary: { type: String, required: false },

    highlights: { type: [String], default: [] },
    image: { type: String, required: false },
  },
  { timestamps: true }
);

const Tour = mongoose.model("Tour", tourSchema);

export default Tour;
