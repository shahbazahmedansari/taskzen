import z from "zod";
import User from "../model/User.model.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";

dotenv.config();

export const signupUser = async (req, res) => {
    try {
        const requestBody = z.object({
            username: z.string().min(3).max(30),
            email: z.string().email().min(3).max(30),
            password: z.string().min(3).max(30),
        });

        const parsedInput = requestBody.safeParse(req.body);

        if (!parsedInput.success) {
            res.status(401).json({
                message: "Incorrect inputs",
                success: false,
            });
        }

        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({
                message: "Please enter all valid inputs",
                success: true,
            });
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                message: "User already exists",
                success: false,
            });
        }

        const user = await User.create({
            username,
            email,
            password,
        });

        if (!user) {
            return res.status(400).json({
                message: "User not signed up",
                success: false,
            });
        }

        res.status(201).json({
            message: "User signed up successfully",
            success: true,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error",
            success: false,
            error,
        });
    }
};

export const loginUser = async (req, res) => {
    try {
        const requestBody = z.object({
            email: z.string().email().min(3).max(30),
            password: z.string().min(3).max(30),
        });

        const parsedBody = requestBody.safeParse(req.body);

        if (!parsedBody.success) {
            return res.status(401).json({
                message: "Incorrect inputs",
                success: false,
            });
        }

        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Invalid email or password",
                success: false,
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                message: "User not found",
                success: true,
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({
                message: "Invalid email or password",
                success: false,
            });
        }

        const token = jwt.sign(
            {
                id: user._id,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "24h",
            }
        );

        const cookieOptions = {
            httpOnly: true,
            secure: true,
            maxAge: 24 * 60 * 60 * 1000,
        };

        res.cookie("token", token, cookieOptions);

        res.status(201).json({
            message: "User logged in successfully",
            success: true,
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
            },
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error",
            success: false,
            error,
        });
    }
};

export const logoutUser = async (req, res) => {
    try {
        res.cookie("token", "", {});
        res.status(200).json({
            message: "User logged out successfully",
            success: true,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error",
            success: false,
        });
    }
};
