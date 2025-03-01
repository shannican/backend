const Candidate = require("../models/candidateModel");
const path = require("path");
const fs = require("fs");
export const addCandidate = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(403).json({ message: "Unauthorized action" });
    }
    const { fullName, email, phone, position, experience } = req.body;
    const resume = req.file ? req.file.filename : null;

    if (!resume) {
      return res.status(400).json({ message: "Resume file required" });
    }

    const newCandidate = new Candidate({
      fullName,
      email,
      phone,
      position,
      experience,
      resume,
    });

    await newCandidate.save();
    res.status(201).json({ message: "Candidate added successfully!" });
  } catch (error) {
    console.error("Error in addCandidate:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
exports.getCandidates = async (req, res) => {
  try {
    const candidates = await Candidate.find();
    console.log("Fetched Candidates:", candidates);
    if (!candidates.length) {
      return res.status(404).json({ msg: "No candidates found" });
    }
    res.status(200).json(candidates);
  } catch (error) {
    console.error("Error in getCandidates:", error); 
    res.status(500).json({ msg: "Server Error", error: error.message });
  }
};

exports.downloadResume = async (req, res) => {
  try {
    const { id } = req.params;
    const candidate = await Candidate.findById(id);
    if (!candidate) {
      return res.status(404).json({ msg: "Candidate not found" });
    }

    const resumePath = path.join(__dirname, "../uploads", candidate.resume);
    if (!fs.existsSync(resumePath)) {
      return res.status(404).json({ msg: "Resume file not found" });
    }

    res.download(resumePath);
  } catch (error) {
    console.error("Error in downloadResume:", error);
    res.status(500).json({ msg: "Server Error", error: error.message });
  }
};

exports.deleteCandidate = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`Deleting Candidate with ID: ${id}`);

    const candidate = await Candidate.findById(id);
    if (!candidate) {
      console.log("Candidate not found!");
      return res.status(404).json({ msg: "Candidate not found" });
    }

    const resumePath = path.join(__dirname, "../uploads", candidate.resume);
    console.log(`Resume Path: ${resumePath}`);

    if (fs.existsSync(resumePath)) {
      fs.unlinkSync(resumePath);
      console.log("Resume file deleted successfully.");
    } else {
      console.log("Resume file not found, skipping delete.");
    }

    await Candidate.findByIdAndDelete(id);
    console.log("Candidate deleted from database.");

    res.status(200).json({ msg: "Candidate deleted successfully" });
  } catch (error) {
    console.error("Error in deleteCandidate:", error);
    res.status(500).json({ msg: "Server Error", error: error.message });
  }
};

