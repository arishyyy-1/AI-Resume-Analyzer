const express = require("express");
const multer = require("multer");
const { extractTextFromPdf } = require("../utils/pdfParser");
const { analyzeResumeWithGemini } = require("../utils/geminiClient");
const { requireAuth } = require("../middleware/auth");
const Analysis = require("../models/Analysis");

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== "application/pdf") {
      return cb(new Error("Only PDF files are allowed"));
    }
    cb(null, true);
  }
});

// POST /api/resume/analyze (protected)
router.post("/analyze", requireAuth, upload.single("resume"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No PDF file uploaded." });
    }

    const resumeText = await extractTextFromPdf(req.file.buffer);
    if (!resumeText || resumeText.length < 50) {
      return res.status(400).json({
        success: false,
        message: "Could not extract readable text from this PDF."
      });
    }

    const jobDescription = req.body.jobDescription || "";
    const analysis = await analyzeResumeWithGemini(resumeText, jobDescription);

    // Save to MongoDB
    await Analysis.create({
      userId: req.userId,
      fileName: req.file.originalname,
      jobDescription,
      result: analysis
    });

    return res.json({ success: true, analysis });
  } catch (err) {
    console.error("Resume analysis error:", err.message);
    return res.status(500).json({ success: false, message: "Something went wrong while analyzing the resume." });
  }
});

// GET /api/resume/history (protected) - past analyses for logged in user
router.get("/history", requireAuth, async (req, res) => {
  try {
    const history = await Analysis.find({ userId: req.userId })
      .sort({ createdAt: -1 })
      .select("fileName jobDescription result.atsScore result.summary createdAt");
    res.json({ success: true, history });
  } catch (err) {
    res.status(500).json({ success: false, message: "Could not fetch history." });
  }
});

module.exports = router;
