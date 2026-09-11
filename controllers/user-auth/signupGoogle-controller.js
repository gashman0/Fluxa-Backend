import userModel from "../../models/user-model.js";
import { OAuth2Client } from "google-auth-library";
import { generateTokens } from "../../utils/generate-tokens.js";
import { setAuthCookies } from "../../utils/set-auth-cookies.js";

const client = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID
);

export const googleSignup = async (req, res) => {
    try {
        const { credential } = req.body;

        if(!credential) {
            return res.status(400).json({
                message: "Goodle credential is required",
            });
        }

        const ticket = await client.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();


        const googleId = payload.sub;
        const email = payload.email;
        const name = payload.name;

        console.log({
            googleId, email, name
        })

        let user = await userModel.findOne({ email });
        
        if(!user) {
            user = await userModel.create({
                name, email, googleId,
            });
        }

        const { accessToken, refreshToken} = generateTokens(user._id);
        setAuthCookies(res, accessToken, refreshToken);

        console.log("Fluxa user:", user);

        return res.status(200).json({
            message: "Google authentication successsful",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            },
        });


    } catch (error) {
        console.error("Google authentication error:", error);

        return res.status(500).json({
            message: "Google authentication failed",
        });
    }
}