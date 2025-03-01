import express from "express";
import { deleteAttendance, getAllAttendance, markAttendance, viewAttendance } from "../controllers/attendanceController.js";

const router = express.Router();

router.post("/mark", markAttendance);
router.get("/view", viewAttendance);

router.get("/", getAllAtendance);

router.delete("/:id", deleteAttendance);

export default router;
