import express from 'express';
import multer from 'multer';
import CandidateModel from '../models/candidateModel.js';
import Employee from '../models/employeeModel.js';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/', upload.single('resume'), async (req, res) => {
  try {
    const { name, email, phone, position, experience } = req.body;
    const resume = req.file;
    if (!resume) {
      return res.status(400).json({ message: 'Resume file is required' });
    }
    const newCandidate = new CandidateModel({
      name,
      email,
      phone,
      position,
      experience,
      resume: resume.path,
    });
    await newCandidate.save();
    return res.status(201).json({ message: 'Candidate added successfully' });
  } catch (error) {
    console.error("Error saving candidate:", error);
    return res.status(500).json({ error: 'Failed to add candidate' });
  }
});

router.get('/',  async (req, res) => {
  try {
    const candidates = await CandidateModel.find();
    return res.status(201).json({ message: 'Candidate fetched successfully' , candidates });
  } catch (error) {
    console.error("Error saving candidate:", error);
    return res.status(500).json({ error: 'Failed to add candidate' });
  }
});

router.put('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const candidate = await CandidateModel.findById(id);
    if (!candidate) {
      return res.status(404).json({ message: 'Candidate not found' });
    }
    candidate.status = status;
    await candidate.save();
    if (status === 'approved') {
      const newEmployee = new Employee({
        name: candidate.name,
        email: candidate.email,
        phone: candidate.phone,
        position: candidate.position,
        department: 'TBD',
        joiningDate: new Date()
      });

      await newEmployee.save();
    }

    return res.status(200).json({
      message: 'Status updated successfully',
      candidate: candidate
    });
  } catch (error) {
    console.error("Error updating candidate status:", error);
    return res.status(500).json({ error: 'Failed to update candidate status' });
  }
});

export default router;
