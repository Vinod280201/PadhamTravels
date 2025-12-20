// middlewares/authorizeAdmin.js
export const authorizeAdmin = (req, res, next) => {
  try {
    // `authenticate` should already have set req.user from JWT
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({
        status: false,
        message: "Forbidden: Admin access only.",
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Internal Server Error",
    });
  }
};
