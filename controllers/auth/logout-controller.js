

export const logout = (req, res) => {
    res.clearcookie("accessToken");
    res.clearcookie("refreshToken");

    res.json({
        message: "Logged out"
    });
};