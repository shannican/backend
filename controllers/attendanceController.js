import express from 'express';
import mongoose from 'mongoose';
import Attendance from "../models/attendanceModel.js";
import Employee from "../models/employeeModel.js";

export const markAttendance = async (req, res) => {
  try {
    console.log("Received Data:", req.body);

    const { employeeId, date, status } = req.body;
    if (!employeeId || !date || !status) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (!mongoose.Types.ObjectId.isValid(employeeId)) {
      return res.status(400).json({ message: "Invalid Employee ID" });
    }

    let attendance = await Attendance.findOne({
      employeeId,
      date: { $gte: new Date(date).setHours(0, 0, 0, 0), $lt: new Date(date).setHours(23, 59, 59, 999) }
    });

    if (attendance) {
      attendance.status = status;
    } else {
      attendance = new Attendance({ employeeId, date: new Date(date), status });
    }

    await attendance.save();
    res.status(200).json({ message: "Attendance marked successfully" });
  } catch (error) {
    console.error("Error in markAttendance:", error);
    res.status(500).json({ error: error.message });
  }
};

export const getAttendance = async (req, res) => {
  try {
    const employees = await Employee.find();
    const attendanceRecords = await Attendance.find({
      date: { $gte: new Date().setHours(0, 0, 0, 0), $lt: new Date().setHours(23, 59, 59, 999) }
    });

    const attendanceList = employees.map(emp => {
      const attendance = attendanceRecords.find(att => att.employeeId.toString() === emp._id.toString());
      return {
        _id: emp._id,
        name: emp.name,
        position: emp.position,
        department: emp.department,
        status: attendance ? attendance.status : "Absent",
      };
    });

    res.status(200).json(attendanceList);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteAttendance = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedAttendance = await Attendance.findByIdAndDelete(id);

    if (!deletedAttendance) {
      return res.status(404).json({ message: "Attendance record not found" });
    }

    res.status(200).json({ message: "Attendance deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const viewAttendance = async (req, res) => {
  try {
    const { date } = req.query;
    if (!date) return res.status(400).json({ message: "Date is required" });

    const startDate = new Date(date);
    const endDate = new Date(date);
    endDate.setUTCHours(23, 59, 59, 999);

    const attendance = await Attendance.find({
      date: { $gte: startDate, $lt: endDate }
    }).populate('employeeId', 'name department');

    const formattedAttendance = attendance.map(record => ({
      _id: record._id,
      employeeName: record.employeeId?.name || "Unknown",
      department: record.employeeId?.department || "Unknown",
      date: record.date.toISOString().split('T')[0],
      status: record.status
    }));

    res.status(200).json(formattedAttendance);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllAttendance = async (req, res) => {
  try {
    console.log("Fetching all attendance records...");

    const attendance = await Attendance.find({}).populate({
      path: "employeeId",
      select: "name department position"
    });

    console.log("Attendance Data Fetched:", attendance);

    const formattedAttendance = attendance.map((record) => ({
      _id: record._id,
      employeeName: record.employeeId?.name || "Unknown",
      department: record.employeeId?.department || "Unknown",
      date: record.date.toISOString().split("T")[0],
      status: record.status,
      position: record.employeeId?.position || "Unknown",
      employeeId: record.employeeId?._id?.toString() || "Unknown",
    }));

    res.status(200).json(formattedAttendance);
  } catch (error) {
    console.error("Error fetching attendance:", error);
    res.status(500).json({ error: error.message });
  }
};
