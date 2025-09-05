import {} from "express";
import jwt, {} from "jsonwebtoken";
import { prisma } from '../prisma.js';
const jwtSecret = process.env.JWT_SECRET;
const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: "Token not found" });
        }
        const token = authHeader.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: "Token not found" });
        }
        if (!jwtSecret) {
            console.error("JWT Secret not set!");
            return res.status(500).json({ message: "Server configuration error" });
        }
        const decoded = jwt.verify(token, jwtSecret);
        const user = await prisma.user.findUnique({ where: { userId: decoded.id } });
        if (!user) {
            return res.status(401).json({ message: 'Unauthorized - Invalid user' });
        }
        req.userId = user.userId;
        req.role = user.role;
        next();
    }
    catch (e) {
        console.error("Token Verification Error:", e);
        return res.status(401).json({ message: "Invalid token" });
    }
};
export default authMiddleware;
//# sourceMappingURL=authMiddleware.js.map