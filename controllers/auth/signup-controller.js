import userModel from '../../models/user-model.js';
import bcrypt from 'bcrypt';


export const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        
        const userExists = await userModel.findOne({email})
        if(userExists) return res.status(400).json({
            Message: "User already exists"
        })

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await userModel.create({
            name, email, password: hashedPassword,
        });

        res.status(201).json({
            message: "User signed up successfully!",
            user: {id: user._id, name: user.name, email: user.email, createdAt: user.createdAt,}
        });

    } catch (error) {
        res.status(500).json({
            message: "Internal server error", error: error
        })
    }
}