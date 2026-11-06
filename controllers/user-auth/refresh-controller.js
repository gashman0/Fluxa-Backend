
import jwt from "jsonwebtoken";
import { cookieOptions } from "../../config/cookie-config.js";

export const refresh = (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({
      message: "No refresh token",
    });
  }

  try {
    const decoded = jwt.verify(
      refreshToken,
      process.env.REFRESH_SECRET
    );

    const newAccessToken = jwt.sign(
      { id: decoded.id },
      process.env.JWT_SECRET,
      { expiresIn: "30m" }
    );

    res.cookie("accessToken", newAccessToken, {
      ...cookieOptions,
      maxAge: 1000 * 60 * 30,
    });

    return res.status(200).json({
      message: "Token refreshed",
    });

  } catch (error) {
    console.error("Refresh token error:", error.message);

    return res.status(401).json({
      message: "Invalid refresh token",
    });
  }
};
