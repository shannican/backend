import mongoose from 'mongoose';

const employeeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    position: { type: String, required: true },
    department: { type: String, required: true },
  email: String,
  phone: String,
  joiningDate: Date,
});

export const Employee = mongoose.model('Employee', employeeSchema); 

export default Employee;  // ✅ Default export use karo
