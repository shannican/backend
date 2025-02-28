import { Leave } from '../models/leaveModel.js';
import { Employee } from '../models/employeeModel.js';

export const getLeaves = async (req, res) => {
    try {
        const leaves = await Leave.find()
            .populate('employee', 'name profilePic')
            .sort({ date: -1 });
        
        const formattedLeaves = leaves.map(leave => ({
            _id: leave._id,
            name: leave.employee.name,
            profilePic: leave.employee.profilePic,
            date: leave.date.toISOString().split('T')[0],
            reason: leave.reason,
            status: leave.status,
            documents: leave.documents
        }));

        res.status(200).json({ leaves: formattedLeaves });
    } catch (error) {
        res.status(500).json({ message: "Error fetching leaves", error: error.message });
    }
};

export const getLeaveCountByDate = async (req, res) => {
    try {
        const leaveCounts = await Leave.aggregate([
            {
                $match: { status: 'Approved' }
            },
            {
                $group: {
                    _id: {
                        $dateToString: {
                            format: "%Y-%m-%d",
                            date: "$date",
                            timezone: "Asia/Kolkata" // Add timezone for India
                        }
                    },
                    count: { $sum: 1 }
                }
            }
        ]);
        res.status(200).json(leaveCounts);
    } catch (error) {
        res.status(500).json({ message: "Error fetching leave counts", error: error.message });
    }
};

export const createLeave = async (req, res) => {
    try {
        const { employeeId, date, reason, documents } = req.body;
        const newLeave = new Leave({
            employee: employeeId,
            date,
            reason,
            documents
        });
        await newLeave.save();
        res.status(201).json(newLeave);
    } catch (error) {
        res.status(500).json({ message: "Error creating leave", error: error.message });
    }
};

export const updateLeaveStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const leave = await Leave.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );
        res.status(200).json(leave);
    } catch (error) {
        res.status(500).json({ message: "Error updating leave status", error: error.message });
    }
};
