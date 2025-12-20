import express from "express";
import { Login, Logout, Register } from "../controllers/AuthController.js";
import { authenticate } from "../middleware/authenticate.js";
import { authorizeAdmin } from "../middleware/adminAuthenticate.js";

const router = express.Router();

router.post("/register", Register);
router.post("/login", Login);
router.get("/get-user", authenticate, (req, res) => {
  res.status(200).json({ status: true, user: req.user });
});
router.get("/admin-dashboard", authenticate, authorizeAdmin, (req, res) => {
  res.status(200).json({
    status: true,
    message: "Admin dashboard.",
    user: req.user,
  });
});

router.post("/logout", Logout);

export default router;
