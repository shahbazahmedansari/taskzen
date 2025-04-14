import express from "express";
import {
    loginUser,
    logoutUser,
    signupUser,
} from "../controller/auth.controller.js";
import { isLoggedIn } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/signup", signupUser);
router.post("/login", loginUser);
router.get("/logout", isLoggedIn, logoutUser);

export default router;
