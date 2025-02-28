import { Employee } from '../models/employeeModel.js';  
export const getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find();
    res.status(200).json(employees);
  } catch (error) {
    res.status(500).json({ message: "Error fetching employees", error: error.message });
  }
};

export const addEmployee = async (req, res) => {
    try {
      const { name, email, phone, position, department, joiningDate } = req.body;
      const newEmployee = new Employee({ name, email, phone, position, department, joiningDate });
      await newEmployee.save();
      res.status(201).json(newEmployee);
    } catch (error) {
      res.status(500).json({ message: 'Error adding employee', error });
    }
  };
  