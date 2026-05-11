import userModel from "../../models/user-model.js";


export const getMe = async (req, res)=> {
    console.log("This is the cookie from me", req.cookies);
    try {
        const user = await userModel.findById(req.user.id).select("-password");
        res.json(user);
    } catch (error) {
        res.status(500).json({
            message: "Internal server error"
        });
    }
}