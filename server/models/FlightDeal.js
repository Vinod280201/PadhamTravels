import mongoose from "mongoose";

const flightDealSchema = new mongoose.Schema(
  {
    origin: { type: String, required: true },
    destination: { type: String, required: true },
    type: { type: String, default: "Direct Flight" }, // e.g., "Direct Flight", "Connecting Flight"
    dealName: { type: String }, //  e.g., "Feb Month SPL Deal" (Optional)
    date: { type: String, required: true },
    price: { type: Number, required: true },
    alert: { type: String },
    validity: { type: String },
  },
  { timestamps: true },
);

const FlightDeal = mongoose.model("FlightDeal", flightDealSchema);

export default FlightDeal;
