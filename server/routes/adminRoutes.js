import express from "express";
const router = express.Router();
import {
  getAgencyToken,
  clearTokenCache,
  getCachedToken,
} from "../services/agencyService.js";

/**
 * @route   GET /api/admin/sync-status
 * @desc    Checks if there is an active Agency Token in the server cache
 */
router.get("/sync-status", (req, res) => {
  try {
    const token = getCachedToken();
    // Return isSynced true if token exists and is not null/undefined
    res.status(200).json({
      isSynced: !!token,
    });
  } catch (error) {
    res.status(500).json({ isSynced: false, message: "Error checking status" });
  }
});

/**
 * @route   POST /api/admin/agency-login
 * @desc    Authenticates with the Flight API and updates the server-side cache
 */
router.post("/agency-login", async (req, res) => {
  try {
    const { email, password, companyCode } = req.body;

    console.log(`🔄 Manual sync initiated for: ${email || "Default Admin"}`);

    // Clear existing cache to force a fresh login with the provided credentials
    clearTokenCache();

    // Fetch new token from the external Test API
    const token = await getAgencyToken(email, password, companyCode);

    res.status(200).json({
      success: true,
      message: "Agency API Synced Successfully",
      token: token,
    });
  } catch (error) {
    console.error("❌ Agency Sync Failed:", error.message);
    res.status(500).json({
      success: false,
      message: error.message || "External API Sync failed",
    });
  }
});

export default router;
