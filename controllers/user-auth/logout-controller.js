import { cookieOptions } from "../../config/cookie-config.js";

export const logout = (req, res) => {
  res.clearCookie("accessToken", cookieOptions);
  res.clearCookie("refreshToken", cookieOptions);

  res.status(200).json({
    message: "Logged out",
  });
};