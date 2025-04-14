import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import db from "./utils/db.js";
// import user routes
import userRoutes from "./routes/auth.routes.js";

dotenv.config();

const port = process.env.PORT || 4000;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Connect to database
db();

// User Routes
app.use("/api/v1/users", userRoutes);

app.listen(port, () => {
    console.log(`Backend started running on port ${port}`);
});
