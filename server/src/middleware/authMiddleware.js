import jwt from "jsonwebtoken";
import { User } from "../models/userModel.js";

export const authenticateToken = async (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.TOKEN_KEY);

    const user = await User.findById(decoded.user_id);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    if (!user.isActive) {
      return res.status(400).json({ message: "User is not active." });
    }

    const tokenExpiryThreshold = 5 * 60 * 1000; // 5 minutes left for token expiry
    const remainingTime = decoded.exp * 1000 - Date.now();

    if (remainingTime < tokenExpiryThreshold) {
      const newToken = jwt.sign({ user_id: user._id, email: user.email }, process.env.TOKEN_KEY, {
        expiresIn: "1h",
      });

      res.setHeader("Authorization", `Bearer ${newToken}`);
    }

    user.lastActivity = Date.now();
    await user.save();

    const inactivityTimeout = 30 * 60 * 1000; // 30 minutes
    if (Date.now() - user.lastActivity > inactivityTimeout) {
      user.isActive = false;
      await user.save();
      return res.status(400).json({ message: "User is not active." });
    }

    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid token." });
  }
};
