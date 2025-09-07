import express from "express";
import { createClass, allClasses } from "../controllers/classController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const classesRouter = express.Router();

classesRouter.post("/create", authMiddleware, createClass);
classesRouter.get("/allClasses", authMiddleware, allClasses);
// classesRouter.post("/delete-device", authMiddleware ,logout);

export default classesRouter;