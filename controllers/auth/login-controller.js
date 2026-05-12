import userModel from "../../models/user-model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const login = async (req, res) => {
  const isProduction = process.env.NODE_ENV === "production";

  console.log(isProduction ? "production" : "dev");

  console.log("NODE_ENV:", process.env.NODE_ENV);
  console.log("isProduction:", isProduction);

  try {
    const { email, password } = req.body;

    // Check if the account actually exits
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    // Check if the password matches
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    // Create an access token
    const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "30m",
    });

    // Create a refresh toke
    const refreshToken = jwt.sign(
      { id: user._id },
      process.env.REFRESH_SECRET,
      { expiresIn: "1d" },
    );

    // Store the tokens in http-only cookie
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      path: "/",
      maxAge: 1000 * 60 * 30, // 30mins
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      path: "/",
      maxAge: 1000 * 60 * 60 * 24 * 1, // 1day
    });

    // Send response to the user
    res.status(200).json({
      message: "Login Successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};
