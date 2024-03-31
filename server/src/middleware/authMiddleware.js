import jwt from "jsonwebtoken";

export const authenticateToken = (req, res, next) => {
  const token = req.header("authorization")?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ msg: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.TOKEN_KEY);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ msg: "Invalid token." });
  }
};
