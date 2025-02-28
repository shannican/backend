import mongoose from 'mongoose';

const leaveSchema = new mongoose.Schema({
    employee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    reason: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Approved', 'Rejected'],
        default: 'Pending'
    },
    documents: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export const Leave = mongoose.model('Leave', leaveSchema);
