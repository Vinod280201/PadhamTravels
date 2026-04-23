import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    bookingRef: {
      type: String,
      required: true,
      unique: true,
    },
    customerName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    flightDetails: {
      // General title like "AI-202 DEL -> BLR"
      type: String,
      required: true,
    },
    departureTime: {
      type: String,
    },
    arrivalTime: {
      type: String,
    },
    bookingDate: {
      type: Date,
      required: true,
    },
    travelDate: {
      type: Date,
      required: true,
    },
    passengers: {
      type: Number,
      required: true,
      default: 1,
    },
    amount: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["Confirmed", "Pending", "Cancelled", "Failed"],
      default: "Pending",
    },
    searchId: {
      type: String,
    },
    priceId: {
      type: String,
    },
    rawBookingData: {
      // Store the full B2B booking API response for future reference/ticketing
      type: mongoose.Schema.Types.Mixed,
    },
    fcn: {
      // Fare Classification Name (e.g., 'PUBLISH', 'SPICEMAX', 'SAVER (REGULAR)')
      type: String,
    },
    airlinePnr: {
      type: String,
    },
    gdsPnr: {
      type: String,
    },
    commissionAmount: {
      type: Number,
      default: 0
    },
    cancellation: {
      status: {
        type: String,
        enum: ["pending", "quoted", "confirmed", "completed", "declined"],
        default: null
      },
      reason: String,
      refundAmount: {
        type: Number,
        default: 0
      },
      cancellationFee: {
        type: Number,
        default: 0
      },
      adminNotes: String,
      requestDate: Date,
      quoteDate: Date
    },
    reschedule: {
      status: {
        type: String,
        enum: ["pending", "processed", "declined"],
        default: null
      },
      preferredDate: String,
      reason: String,
      newFlightDetails: {
        flightNumber: String,
        departureTime: String,
        arrivalTime: String,
        pnr: String
      },
      rescheduleFee: {
        type: Number,
        default: 0
      },
      adminNotes: String,
      requestDate: Date,
      processDate: Date
    }
  },
  { timestamps: true }
);

export const Booking = mongoose.model("Booking", bookingSchema);
