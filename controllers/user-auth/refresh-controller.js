import jwt from "jsonwebtoken";

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

    // Cookie configuration
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.COOKIE_SECURE === "true",
      sameSite: process.env.COOKIE_SAME_SITE || "lax",
      path: "/",
    };

    res.cookie("accessToken", newAccessToken, {
      ...cookieOptions,
      maxAge: 1000 * 60 * 30,
    });

    return res.status(200).json({
      message: "Token refreshed",
    });

  } catch (error) {
    return res.status(401).json({
      message: "Invalid refresh token",
    });
  }
};