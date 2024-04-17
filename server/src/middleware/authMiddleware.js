import jwt from "jsonwebtoken";
import { User } from "../models/userModel.js";

const authenticateToken = async (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.TOKEN_KEY); // if expired, throws an error

    const user = await User.findById(decoded.user_id);

    if (!user) {
      return res.status(404).json({ type: "UserNotFoundError", message: "User not found." });
    }
    if (!user.isActive) {
      return res.status(400).json({ message: "User is not active." });
    }

    const inactivityTimeoutThreshold = 30 * 60 * 1000; // 30 minutes of inactivity
    const userInactivityTime = Date.now() - user.lastActivity;
    if (userInactivityTime > inactivityTimeoutThreshold) {
      // if user was inactive for more than 30 minutes, log them out
      user.isActive = false;
      await user.save();
      return res.status(401).json({ message: "User logged out due to inactivity." });
    }

    user.lastActivity = Date.now();
    await user.save();

    res.removeHeader("Access-Control-Expose-Headers");
    res.removeHeader("Authorization");

    const tokenExpiryThreshold = 10 * 60 * 1000; // 10 minutes before expiry
    const remainingTime = decoded.exp * 1000 - Date.now();

    if (remainingTime < tokenExpiryThreshold) {
      // if token is about to expire, generate a new one
      const newToken = jwt.sign({ user_id: user._id, email: user.email }, process.env.TOKEN_KEY, {
        expiresIn: "1h",
      });

      res.setHeader("Access-Control-Expose-Headers", "Authorization");
      res.setHeader("Authorization", `Bearer ${newToken}`);
    }

    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      const decoded = jwt.decode(token);
      const user = await User.findById(decoded.user_id);
      if (user) {
        // log out user if token expired
        user.isActive = false;
        await user.save();
      }
      return res.status(401).json({ message: "Token expired." });
    } else {
      return res.status(401).json({ message: "Invalid token." });
    }
  }
};

const authenticateAdmin = async (req, res, next) => {
  const user = await User.findById(req.user.user_id);
  if (user.role !== "admin") {
    return res.status(403).json({ type: "AccessDeniedError", message: "Access denied, admin only." });
  }

  next();
};

export { authenticateToken, authenticateAdmin };