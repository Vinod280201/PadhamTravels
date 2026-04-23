import express from "express";
import {
  Login,
  Logout,
  Register,
  requireAuth,
  Me,
  UpdateProfile,
} from "../controllers/AuthController.js";
import { authenticate } from "../middlewares/authenticate.js";
import { authorizeAdmin } from "../middlewares/adminAuthenticate.js";

const router = express.Router();

// Auth routes
router.post("/register", Register);
router.post("/login", Login);

// Get current user (used by frontend after login)
router.get("/get-user", Me);

// Optional: Do the same for /me if you use it
router.get("/me", Me);

// Update user details
router.put("/update-profile", requireAuth, UpdateProfile);

// Admin-only route example
router.get("/admin/dashboard", authenticate, authorizeAdmin, (req, res) => {
  res.status(200).json({
    status: true,
    message: "Admin dashboard.",
    user: req.user,
  });
});

// Logout
router.post("/logout", Logout);

export default router;
