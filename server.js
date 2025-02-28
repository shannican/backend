import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js"; 
import authRoutes from "./routes/authRoutes.js";
import candidateRoutes from "./routes/candidateRoutes.js";
import morgan from "morgan";
import attendanceRoutes from "./routes/attendanceRoutes.js";
import employeeRoutes from "./routes/employeeRoutes.js";
import leavesRoutes from "./routes/leaveRoutes.js";

dotenv.config();

connectDB();

const app = express();
app.use(cors({
    origin: true,
    credentials: true,
})); 

app.use(morgan("dev"));
app.use(express.json()); 
app.use("/uploads", express.static("uploads")); 


app.use("/api/auth", authRoutes); 
app.use("/api/candidates", candidateRoutes);
app.use("/api/attendance", attendanceRoutes); 
app.use("/api/employees", employeeRoutes); 
app.use("/api/leaves", leavesRoutes); 

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
