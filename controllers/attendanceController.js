import e from "express";
import Attendance from "../models/attendanceModel.js";
import Employee from "../models/employeeModel.js";

export const markAttendance = async (req, res) => {
  try {
    console.log("Received Data:", req.body); // Debugging

    const { employeeId, date, status } = req.body;
    if (!employeeId || !date || !status) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    let attendance = await Attendance.findOne({ employeeId, date });

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
    const attendanceRecords = await Attendance.find({ date: new Date().toDateString() });
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
    await Attendance.findOneAndDelete({ 
      _id: id
    });
    res.status(200).json({ message: "Attendance deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const viewAttendance = async (req, res) => {
  try {
    const { date } = req.query;
    const startDate = new Date(date);
    const endDate = new Date(date);
    endDate.setDate(endDate.getDate() + 1);

    const attendance = await Attendance.find({
      date: {
        $gte: startDate,
        $lt: endDate
      }
    }).populate('employeeId', 'name department');

    const formattedAttendance = attendance.map(record => ({
      _id: record._id,
      employeeName: record.employeeId.name,
      department: record.employeeId.department,
      date: record.date,
      status: record.status
    }));

    res.status(200).json(formattedAttendance);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllAtendance = async (req, res) => {
  try {
    const attendance = await Attendance.find().populate('employeeId');
    const formattedAttendance = attendance.map(record => ({
      _id: record._id,
      employeeName: record.employeeId.name,
      department: record.employeeId.department,
      date: record.date,
      status: record.status,
      position: record.employeeId.position,
      employeeId: record.employeeId._id.toString()
    }));
    console.log(formattedAttendance);
    
    res.status(200).json(formattedAttendance);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}