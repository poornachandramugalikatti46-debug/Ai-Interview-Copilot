import jwt from "jsonwebtoken";
import User from "../models/User.js";

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "No token provided",
      });
    }

    const parts = authHeader.split(" ");

    if (parts.length !== 2 || parts[0] !== "Bearer") {
      return res.status(401).json({
        success: false,
        message: "Invalid token format",
      });
    }

    const token = parts[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");

    req.user = decoded;
    next();
  } catch (error) {
    console.error("JWT Error:", error.message);

    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }
};

export const protect = async (req, res, next) => {
  try {
    console.log("========== AUTH DEBUG ==========\n");
    console.log("Authorization Header:", req.headers.authorization);

    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Authorization token missing",
      });
    }

    const token = authHeader.split(" ")[1];

    console.log("Token:", token);

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");

    console.log("Decoded:", decoded);

    const user = await User.findById(decoded.id).select("-password");

    console.log("User:", user);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User no longer exists",
      });
    }

    req.user = user;
    next();

  } catch (error) {
    console.error("AUTH ERROR:", error);

    return res.status(401).json({
      success: false,
      message: error.message,
    });
  }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: insufficient permissions",
      });
    }

    next();
  };
};

export default authMiddleware;