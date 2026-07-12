const { GoogleGenAI } = require("@google/genai");

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function analyzeResumeWithGemini(resumeText, jobDescription) {
  if (!jobDescription) jobDescription = "";

  var prompt = "You are an expert ATS (Applicant Tracking System) and career coach.\n\n" +
    "Analyze the following resume text" + (jobDescription ? " against the provided job description" : "") + ".\n\n" +
    "RESUME TEXT:\n\"\"\"\n" + resumeText + "\n\"\"\"\n\n" +
    (jobDescription ? "TARGET JOB DESCRIPTION:\n\"\"\"\n" + jobDescription + "\n\"\"\"\n\n" : "") +
    "Respond ONLY with valid JSON (no markdown, no backticks, no preamble) in exactly this shape:\n\n" +
    "{\n" +
    "  \"atsScore\": <number 0-100>,\n" +
    "  \"atsIssues\": [\"issue 1\", \"issue 2\"],\n" +
    "  \"strengths\": [\"strength 1\", \"strength 2\"],\n" +
    "  \"skillGaps\": [\"missing skill 1\", \"missing skill 2\"],\n" +
    "  \"recommendations\": [\"recommendation 1\", \"recommendation 2\"],\n" +
    "  \"summary\": \"2-3 sentence overall summary\"\n" +
    "}";

  const response = await genAI.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt
  });

  var rawText = response.text;
  var cleaned = rawText.replace(/```json/g, "").replace(/```/g, "").trim();

  try {
    return JSON.parse(cleaned);
  } catch (err) {
    throw new Error("Failed to parse Gemini response: " + rawText.slice(0, 200));
  }
}

module.exports = { analyzeResumeWithGemini };
