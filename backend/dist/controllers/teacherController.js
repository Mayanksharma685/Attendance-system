import {} from "express";
import z from "zod";
import { prisma } from "../prisma.js";
export const myClasses = async (req, res) => {
    if (req.role !== "TEACHER") {
        return res.status(400).json({ message: "Only teachers can get their classes" });
    }
    try {
        const classes = await prisma.class.findMany({
            where: { teacherId: req.userId },
            select: {
                id: true,
                name: true,
                isAttendanceOpen: true,
                createdAt: true,
                enrollments: {
                    select: { id: true, studentId: true }
                }
            }
        });
        const total = await prisma.class.count({
            where: { teacherId: req.userId }
        });
        res.json({ total, classes });
    }
    catch (err) {
        console.error("Get classes error:", err);
        res.status(500).json({ message: "Server error" });
    }
};
export const openAttendance = async (req, res) => {
    if (req.role !== "TEACHER") {
        return res.status(400).json({ message: "Only teachers can open attendance" });
    }
    try {
        const schema = z.object({ classId: z.number() });
        const result = schema.safeParse(req.body);
        if (!result.success) {
            return res.status(400).json({ message: "Invalid input" });
        }
        const { classId } = result.data;
        const class_ = await prisma.class.findUnique({ where: { id: classId } });
        if (!class_)
            return res.status(400).json({ message: "Class not found" });
        if (class_.teacherId !== req.userId) {
            return res.status(403).json({ message: "You are not authorized to open attendance" });
        }
        if (class_.isAttendanceOpen) {
            return res.status(400).json({ message: "Class is already open for attendance" });
        }
        const updated = await prisma.class.update({
            where: { id: classId },
            data: { isAttendanceOpen: true }
        });
        res.status(200).json({
            message: "Attendance opened successfully",
            class: {
                id: updated.id,
                name: updated.name,
                isAttendanceOpen: updated.isAttendanceOpen,
                teacherId: updated.teacherId
            }
        });
    }
    catch (err) {
        console.error("Open attendance error:", err);
        res.status(500).json({ message: "Server error" });
    }
};
export const closeAttendance = async (req, res) => {
    if (req.role !== "TEACHER") {
        return res.status(400).json({ message: "Only teachers can close attendance" });
    }
    try {
        const schema = z.object({ classId: z.number() });
        const result = schema.safeParse(req.body);
        if (!result.success) {
            return res.status(400).json({ message: "Invalid input" });
        }
        const { classId } = result.data;
        const class_ = await prisma.class.findUnique({ where: { id: classId } });
        if (!class_)
            return res.status(400).json({ message: "Class not found" });
        if (class_.teacherId !== req.userId) {
            return res.status(403).json({ message: "You are not authorized to close attendance" });
        }
        if (!class_.isAttendanceOpen) {
            return res.status(400).json({ message: "Class is already closed for attendance" });
        }
        const updated = await prisma.class.update({
            where: { id: classId },
            data: { isAttendanceOpen: false }
        });
        res.status(200).json({
            message: "Attendance closed successfully",
            class: {
                id: updated.id,
                name: updated.name,
                isAttendanceOpen: updated.isAttendanceOpen,
                teacherId: updated.teacherId
            }
        });
    }
    catch (err) {
        console.error("Close attendance error:", err);
        res.status(500).json({ message: "Server error" });
    }
};
//# sourceMappingURL=teacherController.js.map