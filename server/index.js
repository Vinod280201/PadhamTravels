import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import multer from "multer";
import { fileURLToPath } from "url";

// Import Routes
import AuthRoute from "./routes/auth.route.js";
import flightsRoutes from "./routes/flights.route.js";
import tourRoutes from "./routes/tour.routes.js";
import flightDealRoutes from "./routes/flightDealRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import bookingsRoutes from "./routes/bookings.route.js";
import walletRoutes from "./routes/wallet.route.js";
import inquiryRoutes from "./routes/inquiry.route.js";

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// === 1. DYNAMIC CORS SETUP ===
const allowedOrigins = [
  "http://localhost:5173", // Vite Local Frontend
  "http://localhost:3000", // Local Backend/Frontend on same port
  "https://padham-travels.vercel.app", // Deployed Frontend
];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log("🚫 BLOCKED BY CORS:", origin);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "Accept",
  ],
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

// === 2. MIDDLEWARE ===
app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ extended: true, limit: "25mb" }));
app.use(cookieParser());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// === 3. HEALTH CHECK ===
app.get("/", (req, res) => {
  res.status(200).send("API is running successfully");
});

// === 4. ROUTES ===
app.use("/api/auth", AuthRoute);
app.use("/api/flights", flightsRoutes);
app.use("/api/tours", tourRoutes);
app.use("/api/admin/tours", tourRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/deals", flightDealRoutes);
app.use("/api/bookings", bookingsRoutes);
app.use("/api/wallet", walletRoutes);
app.use("/api/inquiries", inquiryRoutes);

// === 5. GRACEFUL MULTER & UPLOAD ERROR HANDLER ===
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        message: "File size exceeds 20MB limit. Please upload a smaller file.",
      });
    }
    return res.status(400).json({ success: false, message: err.message });
  } else if (err) {
    return res.status(400).json({
      success: false,
      message: err.message || "An error occurred during file upload/request processing.",
    });
  }
  next();
});

// === 6. DATABASE CONNECTION ===
const connectDB = async () => {
  try {
    if (!process.env.MONGODB_CONN) {
      throw new Error("MONGODB_CONN is missing in environment variables!");
    }
    await mongoose.connect(process.env.MONGODB_CONN);
    console.log("✅ Database connected successfully");
  } catch (err) {
    console.error("❌ Database connection failed:", err.message);
  }
};

// === 7. START SERVER ===
const port = process.env.PORT || 3000;

app.listen(port, () => {
  connectDB();
  console.log(`Server is running on port: ${port}`);
});
