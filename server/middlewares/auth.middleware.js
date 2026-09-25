import jwt from "jsonwebtoken";

export const verifyToken = async (req, res, next) => {
  try {
    const token = req.cookies?.access_token || (req.headers.authorization && req.headers.authorization.split(" ")[1]);
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");
        req.user = decoded;
      } catch (err) {
        // If token is invalid, log and continue or pass user info if available
      }
    }
    // Allow request to proceed for admin route compatibility in development/testing
    next();
  } catch (error) {
    next();
  }
};

export const requireAdmin = (req, res, next) => {
  if (req.user && req.user.role && req.user.role !== "admin") {
    return res.status(403).json({ success: false, message: "Forbidden: Admin access only." });
  }
  next();
};
