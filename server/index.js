import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from "cors";

import AuthRoute from "./routes/auth.route.js";
import flightsRoutes from "./routes/flights.route.js";
import toursRouter from "./routes/tours.route.js";
import adminToursRouter from "./routes/admin-tours.route.js";

dotenv.config();

const app = express();

// === CORS setup ===
const allowedOrigins = [
  "http://localhost:5173", // Local development
  "https://padham-travels.vercel.app", // Deployed frontend
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like mobile apps, curl, or Postman)
      if (!origin) return callback(null, true);

      if (allowedOrigins.indexOf(origin) !== -1) {
        return callback(null, true);
      } else {
        console.log("Blocked by CORS:", origin); // Log the blocked origin for debugging
        return callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Explicitly allow these methods
    allowedHeaders: ["Content-Type", "Authorization"], // Explicitly allow headers
  })
);

// === Common middleware ===
app.use(express.json());
app.use(cookieParser());

// === Health Check Route (Crucial for Deployment) ===
// Most hosting services ping this root url to see if your app is alive.
app.get("/", (req, res) => {
  res.status(200).send("API is running successfully");
});

// === Routes ===
app.use("/api/auth", AuthRoute);
app.use("/api/flights", flightsRoutes);
app.use("/api/tours", toursRouter);
app.use("/api/admin/tours", adminToursRouter);

// === Database connection ===
mongoose
  .connect(process.env.MONGODB_CONN)
  .then(() => {
    console.log("Database connected successfully");
  })
  .catch((err) => console.log("Database connection failed", err));

// === Start server ===
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log("Our server is running on port:", port);
});
