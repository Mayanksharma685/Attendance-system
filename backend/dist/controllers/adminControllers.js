import {} from "express";
import z from "zod";
import { prisma } from "../prisma.js";
export const allStudents = async (req, res) => {
    if (req.role !== "ADMIN") {
        return res.status(400).json({ message: "Only admin can get students" });
    }
    try {
        const students = await prisma.user.findMany({
            where: { role: "STUDENT" }
        });
        const total = await prisma.user.count({
            where: { role: "STUDENT" }
        });
        res.json({
            total,
            students
        });
    }
    catch (err) {
        console.error("Get students error:", err);
        res.status(500).json({ message: "Server error" });
    }
};
export const allTeachers = async (req, res) => {
    if (req.role !== "ADMIN") {
        return res.status(400).json({ message: "Only admin can get teachers" });
    }
    try {
        const teachers = await prisma.user.findMany({
            where: { role: "TEACHER" }
        });
        const total = await prisma.user.count({
            where: { role: "TEACHER" }
        });
        res.json({
            total,
            teachers
        });
    }
    catch (err) {
        console.error("Get teachers error:", err);
        res.status(500).json({ message: "Server error" });
    }
};
//# sourceMappingURL=adminControllers.js.map