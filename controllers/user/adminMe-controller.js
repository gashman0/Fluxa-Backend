import adminModel from "../../models/admin.model.js";


export const getMeAdmin = async (req, res) => {
    try{
        const admin = await adminModel.findById(req.admin).select("-password");
        if(!admin){
            return res.status(404).json({
                message: "Admin not found",
            });
        }

        return res.status(200).json({
            admin,
        });
    }catch(error){
        console.error("Get admin error: ", error);
        res.status(500).json({
            message: "Internal server error"
        })
    };
}