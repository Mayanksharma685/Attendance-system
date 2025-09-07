import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import {} from "express";
import z, { includes } from "zod";
import { prisma } from "../prisma.js";
const jwtSecret = process.env.JWT_SECRET;
export const createClass = async (req, res) => {
    if (req.role != "ADMIN") {
        return res.status(400).json({ message: "Only admin can create class" });
    }
    try {
        const classSchema = z.object({
            name: z.string().min(2),
            teacherId: z.number(),
        });
        const result = classSchema.safeParse(req.body);
        if (!result.success) {
            console.log("Validation Error:", result);
            return res.status(400).json({ message: "Invalid input" });
        }
        const { name, teacherId } = result.data;
        const teacher = await prisma.user.findUnique({
            where: {
                userId: teacherId
            },
        });
        if (!teacher)
            return res.status(400).json({ message: "Teacher not found" });
        const newClass = await prisma.class.create({
            data: {
                name,
                teacherId,
            }
        });
        res.status(200).json({
            message: "Class created successfully",
            newClass: {
                id: newClass.id,
                name: newClass.name,
                isAttendanceOpen: newClass.isAttendanceOpen,
                teacherId: newClass.teacherId
            }
        });
    }
    catch (err) {
        console.error("Create class error:", err);
        res.status(500).json({ message: "Server error" });
    }
};
export const allClasses = async (req, res) => {
    if (req.role != "ADMIN") {
        return res.status(400).json({ message: "Only admin can get classes" });
    }
    try {
        const classes = await prisma.class.findMany({
            include: { teacher: true }
        });
        res.json(classes);
    }
    catch (err) {
        console.error("Get classes error:", err);
        res.status(500).json({ message: "Server error" });
    }
};
//# sourceMappingURL=classController.js.map