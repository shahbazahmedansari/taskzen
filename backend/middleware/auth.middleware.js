import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const isLoggedIn = async (req, res, next) => {
    try {
        console.log(req.cookies);
        let token = req.cookies?.token;

        console.log("Token found: ", token ? "YES" : "NO");

        if (!token) {
            console.log("NO token");
            return res.status(400).json({
                message: "Authentication failed",
                success: false,
            });
        }

        const decoded = await jwt.verify(token, process.env.JWT_SECRET);
        console.log("decoded data: ", decoded);
        req.user = decoded;

        next();
    } catch (error) {
        console.log("Authentication middleware failure");
        return res.status(500).json({
            message: "Internal server error",
            success: false,
        });
    }
};
