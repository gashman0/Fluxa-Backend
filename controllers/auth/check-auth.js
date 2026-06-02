import userModel from "../../models/user-model.js";
import jwt from "jsonwebtoken";

export const checkAuth = async (req, res) => {
  try {

    // console.log("Cookies:", req.cookies);

    const accessToken = req.cookies.accessToken;

    // console.log("Access Token:", accessToken);

    if (!accessToken) {
      return res.status(401).json({
        authenticated: false,
      });
    }

    const decode = jwt.verify(accessToken, process.env.JWT_SECRET);

    // console.log("Decoded:", decode);

    const user = await userModel.findById(decode.id);

    //  console.log("User:", user);

    res.status(200).json({
      authenticated: true,
    //   user
    });
  } catch (error) {
    console.log(error);
    res.status(401).json({
      authenticated: false,
    });
  }
};
