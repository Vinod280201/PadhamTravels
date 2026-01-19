import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

// Import Routes
import AuthRoute from "./routes/auth.route.js";
import flightsRoutes from "./routes/flights.route.js";
import toursRouter from "./routes/tours.route.js";
import adminToursRouter from "./routes/admin-tours.route.js";

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
    // Allow requests with no origin (like Postman, Mobile Apps, or Server-to-Server)
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
app.use(express.json());
app.use(cookieParser());
// to serve images from the 'uploads' folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// === 3. HEALTH CHECK ===
app.get("/", (req, res) => {
  res.status(200).send("API is running successfully");
});

// === 4. ROUTES ===
app.use("/api/auth", AuthRoute);
app.use("/api/flights", flightsRoutes);
app.use("/api/tours", toursRouter);
app.use("/api/admin", adminToursRouter);

// === 5. DATABASE CONNECTION ===
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

// === 6. START SERVER ===
// This will use port 3000 locally, or whatever port the server (Render/Heroku) assigns
const port = process.env.PORT || 3000;

app.listen(port, () => {
  connectDB();
  console.log(`Server is running on port: ${port}`);
});
