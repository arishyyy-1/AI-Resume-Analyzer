require("dotenv").config();

console.log("MONGO CHECK:", process.env.MONGO_URI ? "FOUND" : "MISSING");

const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoutes");
const resumeRoutes = require("./routes/resumeRoutes");

const app = express();

app.use(cors({
    origin: [
        "http://localhost:5173",
        "https://ai-resume-analyzer-five-pearl-34.vercel.app"
    ],
    credentials: true
}));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/resume", resumeRoutes);

app.get("/", (req, res) => res.send("LostLink API running."));

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log("Server running on http://localhost:" + PORT));
  })
 .catch((err) => {
  console.error("MongoDB connection error:");
  console.error(err);
});
