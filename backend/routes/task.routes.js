import express from "express";
import {
    createTask,
    deleteTask,
    editTask,
    getTasks,
} from "../controller/task.controller";

const router = express.Router();

router.post("/create-task", createTask);
router.post("/edit-task", editTask);
router.post("/delete-task", deleteTask);
router.get("/get-tasks", getTasks);

export default router;
