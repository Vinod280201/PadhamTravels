import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
// Import the agency service to handle the background sync
import { getAgencyToken } from "../services/agencyService.js";

export const Register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const checkRegisterationStatus = await User.findOne({ email });
    if (checkRegisterationStatus) {
      return res.status(409).json({
        status: false,
        message: "User already registered",
      });
    }

    const hashPassword = bcryptjs.hashSync(password);

    const newRegistration = new User({
      name,
      email,
      password: hashPassword,
      role: "user", // Default role
    });

    await newRegistration.save();

    res.status(200).json({
      status: true,
      message: "Registration success.",
    });
  } catch (error) {
    console.error("FATAL REGISTRATION ERROR:", error);
    res.status(500).json({
      status: false,
      message: "Internal Server Error",
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        status: false,
        message: 'Please provide both email and password.' 
      });
    }

    const cleanEmail = typeof email === 'string' ? email.toLowerCase().trim() : '';

    // Case-insensitive query
    const user = await User.findOne({ email: cleanEmail });
    if (!user) {
      return res.status(400).json({ 
        success: false, 
        status: false,
        message: 'Invalid email or password.' 
      });
    }

    if (!user.password) {
      return res.status(500).json({ 
        success: false, 
        status: false,
        message: 'Authentication setup error. Please contact administrator.' 
      });
    }

    const isMatch = await bcryptjs.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ 
        success: false, 
        status: false,
        message: 'Invalid email or password.' 
      });
    }

    // --- AUTOMATIC BACKGROUND AGENCY SYNC ---
    // If the logged-in user is an admin, trigger the flight API sync immediately
    if (user.role === "admin") {
      try {
        await getAgencyToken();
        console.log(`✅ Background Agency Sync successful for Admin: ${cleanEmail}`);
      } catch (syncError) {
        console.error(
          "⚠️ Background Agency Sync failed during login:",
          syncError.message
        );
      }
    }

    const jwtSecret = process.env.JWT_SECRET || 'fallback_development_secret_key';
    const token = jwt.sign(
      { id: user._id, role: user.role, email: user.email },
      jwtSecret,
      { expiresIn: '7d' }
    );

    res.cookie("access_token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    res.status(200).json({
      success: true,
      status: true,
      token,
      message: "Login success.",
      user: {
        id: user._id,
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        dateOfBirth: user.dateOfBirth,
        gender: user.gender,
        address: user.address
      },
      isSynced: user.role === "admin",
    });
  } catch (error) {
    console.error('Server login controller error:', error);
    res.status(500).json({ 
      success: false, 
      status: false,
      message: 'Server error during login. Please try again.' 
    });
  }
};

export const Login = login;

export const Logout = async (req, res) => {
  try {
    res.clearCookie("access_token", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    return res.status(200).json({
      status: true,
      message: "Logout success.",
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Internal Server Error",
    });
  }
};

export const requireAuth = async (req, res, next) => {
  try {
    const token = req.cookies?.access_token;

    if (!token) {
      return res.status(401).json({
        status: false,
        message: "Not authenticated",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).lean().exec();
    if (!user) {
      return res.status(401).json({
        status: false,
        message: "User not found",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      status: false,
      message: "Invalid or expired token",
    });
  }
};

export const Me = async (req, res) => {
  try {
    const token = req.cookies?.access_token;

    if (!token) {
      return res.status(200).json({
        status: false,
        user: null,
        message: "Guest user",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id)
      .select("-password")
      .lean()
      .exec();

    if (!user) {
      return res.status(200).json({ status: false, user: null });
    }

    return res.status(200).json({
      status: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        dateOfBirth: user.dateOfBirth,
        gender: user.gender,
        address: user.address
      },
    });
  } catch (error) {
    return res.status(200).json({ status: false, user: null });
  }
};

export const UpdateProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const { name, phone, dateOfBirth, gender, address } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          name: name,
          phone: phone,
          dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
          gender: gender,
          address: address,
        },
      },
      { new: true, runValidators: true }
    )
      .select("-password")
      .lean();

    if (!updatedUser) {
      return res.status(404).json({ status: false, message: "User not found" });
    }

    return res.status(200).json({
      status: true,
      message: "Profile updated successfully",
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        dateOfBirth: updatedUser.dateOfBirth,
        gender: updatedUser.gender,
        address: updatedUser.address,
        role: updatedUser.role,
      },
    });
  } catch (error) {
    console.error("Profile Update Error:", error);
    return res.status(500).json({ status: false, message: "Server Error updating profile." });
  }
};
