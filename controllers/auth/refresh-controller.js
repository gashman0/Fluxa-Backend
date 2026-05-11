import jwt from 'jsonwebtoken'

export const refresh = (req, res) => {
    const refreshToken = req.cookies.refreshToken;

    if(!refreshToken) {
        return res.status(401).json({
            message: "No refresh token"
        })
    }
    console.log("This is the cookie from refresh", req.cookies);
    try {
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET);

        const newAccessToken = jwt.sign(
            {id: decoded.id},
            process.env.JWT_SECRET,
            {expiresIn: "15m"}
        );

        res.cookie("accessToken", newAccessToken, {
            httpOnly: true,
            secure: true,
            sameSite: "Strict",
            maxAge: 1000 * 60 * 15  // 15min
        });

        res.status(200).json({
            message: "Token refreshed"
        });
    } catch (error) {
        return res.status.json({
            message: "Invalid refresh token"
        });
    }
}