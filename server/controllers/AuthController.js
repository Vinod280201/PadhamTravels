import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

export const Register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h", // access token valid for 1 hour
    });

    //check if user is already registered or not
    const checkRegisterationStatus = await User.findOne({ email });
    if (checkRegisterationStatus) {
      return res.status(409).json({
        status: false,
        message: "User already registered",
      });
    }

    //hash password
    const hashPassword = bcryptjs.hashSync(password);

    //new registration
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

    console.log(req.body); // Check what data the server received
  } catch (error) {
    //Log the full error object!
    console.error("FATAL REGISTRATION ERROR:", error);
    res.status(500).json({
      status: false,
      message: "Internal Server Error",
    });
  }
};

export const Login = async (req, res) => {
  try {
    const { email, password } = req.body;

    //check if user is already have an account //lean().exec() is used to convert it into object form
    const user = await User.findOne({ email }).lean().exec();
    if (!user) {
      console.log("LOGIN ERROR: user not found", email);
      return res.status(403).json({
        status: false,
        message: "Invalid login credentials.",
      });
    }

    //verify password
    const verifyPassword = await bcryptjs.compare(password, user.password);
    if (!verifyPassword) {
      console.log("LOGIN ERROR: wrong password for", email);
      return res.status(403).json({
        status: false,
        message: "Invalid login credentials.",
      });
    }

    delete user.password;
    console.log(req.body);
    const payload = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h", // access token valid for 1 hour
    });

    res.cookie("access_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      // no expires, no maxAge -> removed when browser session ends
    });

    res.status(200).json({
      status: true,
      message: "Login success.",
      user: { name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      error,
    });
  }
};

export const Logout = async (req, res) => {
  try {
    // clear the same cookie you set in Login
    res.clearCookie("access_token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
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
