import mongoose from "mongoose";

const tourSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    destination: { type: String, required: true },
    duration: { type: String, required: false },
    price: { type: String, required: true },
    currency: {
      type: String,
      enum: ["INR", "USD", "EUR", "AED", "SGD", "THB"],
      default: "INR",
    },
    pricingUnit: {
      type: String,
      enum: ["per person", "for 2 persons", "for couple", "total package"],
      default: "per person",
    },
    rating: { type: Number, default: 0 },
    reviews: { type: Number, default: 0 },

    itinerary: { type: String, required: false },
    highlights: { type: [String], default: [] },
    inclusions: { type: [String], default: [] },
    exclusions: { type: [String], default: [] },
    image: { type: String, required: false },
    images: { type: [String], default: [] },
    isFeatured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Tour = mongoose.model("Tour", tourSchema);

export default Tour;
