// middleware/admin-auth.js

import jwt from "jsonwebtoken";

export const protectAdmin = (req, res, next) => {
  const token = req.cookies.adminAccessToken;

  if (!token) {
    return res.status(401).json({
      message: "Not authorized",
    });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    req.admin = decoded;

    next();
  } catch (error) {
    console.log("Admin JWT Verify Error:", error.message);

    return res.status(401).json({
      message: "Token expired",
    });
  }
};