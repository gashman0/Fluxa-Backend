import userModel from "../models/user-model.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'


export const login = async (req, res) => {
    try {
        const { email, password} = req.body;

        // Check if the account actually exits
        const user = await userModel.findOne({email});
        if(!user) {
            return res.status(400).json({
                message: "Invalid credentials"
            });
        }

        // Check if the password matches
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(400).json({
                message: "Invalid credentials"
            });
        }

        // Create an access token
        const accessToken = jwt.sign(
            {id: user._id},
            process.env.JWT_SECRET,
            {expiresIn: "15m"}
        );

        // Create a refresh toke
        const refreshToken = jwt.sign(
            {id: user._id},
            process.env.REFRESH_SECRET,
            {expiresIn: "1d"}
        )

        // Store the tokens in http-only cookie
        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: "Strict",
            maxAge: 1000 * 60 * 15, // 15mins
        });

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "Strict",
            maxAge: 100 * 60 * 60 * 24 * 1, // 1day
        })

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
        res.status(500).json({
            message: "Internal server error"
        })
    }
}