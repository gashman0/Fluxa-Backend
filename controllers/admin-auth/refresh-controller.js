import jwt from "jsonwebtoken";

export const refresh = (req, res) => {
    const isProduction = process.env.NODE_ENV === "production";
    const refreshToken = req.cookies.adminRefreshToken;

    if(!refreshToken) {
        return res.status(401).json({
            message: "No refresh token",
        });
    }

    try{
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET);

        const newAccessToken = jwt.sign(
            {id: decoded.id },
            process.env.JWT_SECRET,
            {expiresIn: "30m"},
        );

        res.cookie("adminAccessToken", newAccessToken, {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? "none" : "lax",
            path: "/",
            maxAge: 1000 * 60 * 30,
        });

        res.status(200).json({
            message: "Token refreshed",
        });
    }catch(error){
        return res.status(401).json({
            message: "Invalid refresh token",
        });
    }
};