import jwt from 'jsonwebtoken';


export const protect = (req, res, next) => {

    console.log("Protect middleware hit");
    console.log("Cookies:", req.cookies);

    const token = req.cookies.accessToken;

    console.log("Access Token:", token);

    if(!token) {
        return res.status(401).json({
            message: "Not authorized"
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        console.log("Decoded User:", decoded);

        req.user = decoded;
        next();
    } catch (error) {

        console.log("JWT Verify Error:", error.message);
        res.status(401).josn({message: "Token expired"});
    }
}