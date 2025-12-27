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

router.post("/register", Register);
router.post("/login", Login);
router.get("/get-user", authenticate, (req, res) => {
  res.status(200).json({ status: true, user: req.user });
});
router.get("/admin/dashboard", authenticate, authorizeAdmin, (req, res) => {
  res.status(200).json({
    status: true,
    message: "Admin dashboard.",
    user: req.user,
  });
});
router.get("/me", requireAuth, Me);

router.post("/logout", Logout);

export default router;
