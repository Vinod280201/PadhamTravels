import mongoose from "mongoose";

const inquirySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: false },
    destination: { type: String, required: false },
    tourId: { type: mongoose.Schema.Types.ObjectId, ref: "Tour", required: false },
    tourTitle: { type: String, required: false },
    travelDate: { type: String, required: false },
    numberOfTravelers: { type: Number, default: 1 },
    travelers: { type: Number, default: 1 },
    message: { type: String, required: false },
    status: {
      type: String,
      enum: ["Pending", "Contacted", "Closed"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

const Inquiry = mongoose.model("Inquiry", inquirySchema);

export default Inquiry;
