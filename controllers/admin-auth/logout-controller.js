
export const adminLogout = (req, res) => {
    const isProduction = process.env.NODE_ENV === "Production";

    res.clearCookie("adminAccessToken", {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" : "lax",
        path: "/"
    });

    res.clearCookie("adminRefreshToken", {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" : "lax",
        path: "/",
    });

    res.json({
        mesage: "Admin Logged out",
    });
}