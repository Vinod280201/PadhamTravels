import express from "express";
import {
  Login,
  Logout,
  Register,
  requireAuth,
  Me,
} from "../controllers/AuthController.js";
import { authenticate } from "../middlewares/authenticate.js";
import { authorizeAdmin } from "../middlewares/adminAuthenticate.js";

const router = express.Router();

// Auth routes
router.post("/register", Register);
router.post("/login", Login);

// Get current user (used by frontend after login)
router.get("/get-user", requireAuth, Me);

// Optional: same info at /me
router.get("/me", requireAuth, Me);

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
