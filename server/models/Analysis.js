const mongoose = require("mongoose");

const analysisSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    fileName: { type: String, default: "resume.pdf" },
    jobDescription: { type: String, default: "" },
    result: {
      atsScore: Number,
      atsIssues: [String],
      strengths: [String],
      skillGaps: [String],
      recommendations: [String],
      summary: String
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Analysis", analysisSchema);
