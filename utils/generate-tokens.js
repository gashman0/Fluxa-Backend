import jwt from "jsonwebtoken";

export const generateTokens = (userId) => {
  const accessToken = jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    {
      expiresIn: "30m",
    }
  );

  const refreshToken = jwt.sign(
    { id: userId },
    process.env.REFRESH_SECRET,
    {
      expiresIn: "1d",
    }
  );

  return {
    accessToken,
    refreshToken,
  };
};