import adminModel from "../../models/admin.model.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import otpModel from "../../models/otp-model.js";
import { sendAdminOtpEmail } from "../../services/email-service.js";


export const adminLogin = async(req, res) => {
    try{
        const {email, password} = req.body;

        // Check if the admin exists
        const admin = await adminModel.findOne({email});

        if(!admin){
            return res.status(400).json({
                message: "Invalid credentials",
            })
        }

        // Check if password matches
        const isMatch = await bcrypt.compare(password, admin.password);

        if(!isMatch){
            return res.status(400).json({
                message: "Invalid credentials",
            })
        }

        // Generae a 6-digit Otp
        const otp = crypto.randomInt(100000, 1000000).toString();
        console.log("Admin OTP:", otp);

        // Hash the OTP before storing it
        const otpHash = await bcrypt.hash(otp, 10);

        // OTP expires in 5mins
        const expiresAt = new Date(
            Date.now() + 5 * 60 * 1000,
        );

        // Save OTP
        await otpModel.create({
            adminId: admin._id,
            otpHash,
            expiresAt,
        });

        // Send OTP email
        await sendAdminOtpEmail(admin.email, otp);

        return res.status(200).json({
            message: "OTP sent successfully",
        });

        
    }catch(error){
        console.log(error);

        return res.status(500).json({
            message: "Internal server error"
        })
    }
}