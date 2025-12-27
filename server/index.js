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

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
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
