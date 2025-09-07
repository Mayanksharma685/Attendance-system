import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { closeAttendance, myClasses, openAttendance } from "../controllers/teacherController.js";
const teacherRouter = express.Router();
teacherRouter.get("/my-classes", authMiddleware, myClasses);
teacherRouter.post("/open-attendance", authMiddleware, openAttendance);
teacherRouter.post("/close-attendance", authMiddleware, closeAttendance);
export default teacherRouter;
//# sourceMappingURL=teacher.js.map