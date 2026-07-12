import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import AnalysisResult from "../components/AnalysisResult";

export default function Home() {
  const { token, user } = useAuth();
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setAnalysis(null);
    if (!file) { setError("Please select a PDF resume."); return; }

    const formData = new FormData();
    formData.append("resume", file);
    formData.append("jobDescription", jobDescription);

    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/resume/analyze", {
        method: "POST",
        headers: { Authorization: "Bearer " + token },
        body: formData
      });
      const data = await res.json();
      if (!data.success) { setError(data.message); return; }
      setAnalysis(data.analysis);
    } catch {
      setError("Could not reach server. Is the backend running?");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ background: "#F7F9FC", minHeight: "calc(100vh - 60px)" }} className="py-10 px-4">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-1">Welcome back, {user?.name}</p>
          <h1 className="text-3xl font-bold text-slate-900">Resume Analyzer</h1>
          <p className="text-slate-500 text-sm mt-1">Get an ATS score, skill-gap analysis, and AI career recommendations.</p>
        </div>

        {/* Upload card */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-5">

          {/* File upload */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-widest text-slate-500 mb-2">Resume (PDF)</label>
            <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-xl p-6 cursor-pointer hover:border-teal-400 transition-colors group">
              <svg className="w-8 h-8 text-slate-300 group-hover:text-teal-400 transition-colors mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span className="text-sm text-slate-400 group-hover:text-teal-500 transition-colors">
                {file ? file.name : "Click to upload your resume"}
              </span>
              <span className="text-xs text-slate-300 mt-1">PDF only, max 5MB</span>
              <input type="file" accept="application/pdf" onChange={e => setFile(e.target.files[0])} className="hidden" />
            </label>
          </div>

          {/* Job description */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-widest text-slate-500 mb-2">
              Target Job Description <span className="text-slate-300 normal-case font-normal tracking-normal">(optional but recommended)</span>
            </label>
            <textarea rows={4} value={jobDescription} onChange={e => setJobDescription(e.target.value)}
              placeholder="Paste a job description here to get skill-gap analysis tailored to this specific role..."
              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 placeholder-slate-300 focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 resize-none transition-colors" />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-100 rounded-lg px-4 py-3 text-sm text-red-600">{error}</div>
          )}

          <button type="submit" disabled={loading}
            style={{ background: loading ? "#94A3B8" : "#0F1B2D" }}
            className="w-full text-white font-semibold py-3 rounded-xl transition-all text-sm tracking-wide hover:opacity-90 disabled:cursor-not-allowed flex items-center justify-center gap-2">
            {loading ? (
              <>
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                </svg>
                Analyzing your resume...
              </>
            ) : "Analyze Resume →"}
          </button>
        </form>

        <AnalysisResult analysis={analysis} />
      </div>
    </div>
  );
}
