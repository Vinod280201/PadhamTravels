import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from "cors";
import AuthRoute from "./routes/auth.route.js";
import flightsRoutes from "./routes/flights.route.js";
import toursRoutes from "./routes/tours.route.js";

dotenv.config();
const app = express();
const allowedOrigins = [
  "http://localhost:5173", // local Vite
  "https://YOUR-VERCEL-APP.vercel.app", // real Vercel URL here frontend hosted on Vercel
];

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin(origin, callback) {
      // allow requests with no origin (mobile apps, curl, etc.)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error("Not allowed by CORS"), false);
    },
    credentials: true,
  })
);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log("Our server is running on port:", port);
});

//database connection
mongoose
  .connect(process.env.MONGODB_CONN)
  .then(() => {
    console.log("Database connected successfully");
  })
  .catch((err) => console.log("Database connection failed", err));

//router
app.use("/api/auth", AuthRoute);
app.use("/api/flights", flightsRoutes);
app.use("/api/tours", toursRoutes);
