import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const db = () => {
    mongoose
        .connect(process.env.MONGODB_URL)
        .then(() => {
            console.log("Connected to MongoDB Database");
        })
        .catch((err) => {
            console.log("Error in connecting to database", err);
        });
};

export default db;
