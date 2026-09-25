import Tour from "../models/Tour.js";
import Inquiry from "../models/Inquiry.js";
import User from "../models/user.model.js";

export const getDashboardStats = async (req, res) => {
  try {
    const [activeTours, totalInquiries, featuredTours, totalCustomers, recentInquiries] = await Promise.all([
      Tour.countDocuments(),
      Inquiry.countDocuments(),
      Tour.countDocuments({ isFeatured: true }),
      User.countDocuments({ role: { $ne: "admin" } }),
      Inquiry.find().sort({ createdAt: -1 }).limit(5),
    ]);

    res.status(200).json({
      success: true,
      stats: {
        activeTours,
        totalInquiries,
        featuredTours,
        totalCustomers,
      },
      recentInquiries,
    });
  } catch (error) {
    console.error("Dashboard stats fetch error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
