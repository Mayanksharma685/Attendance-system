import express, {} from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import authRouter from "./routes/auth.js";
const app = express();
app.use(cors());
app.use(express.json());
const PORT = process.env.PORT || 3000;
app.use(express.json());
app.get("/test", (req, res) => {
    res.send("Healthy server");
});
app.use("/auth", authRouter);
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
//# sourceMappingURL=index.js.map