import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

export default function History() {
  const { token } = useAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchHistory() {
      try {
        const res = await fetch("http://localhost:5000/api/resume/history", {
          headers: { Authorization: "Bearer " + token }
        });
        const data = await res.json();
        if (data.success) setHistory(data.history);
      } catch {
        console.error("Failed to fetch history");
      } finally {
        setLoading(false);
      }
    }
    fetchHistory();
  }, [token]);

  const scoreColor = (s) => s >= 75 ? "#00C2A8" : s >= 50 ? "#F59E0B" : "#EF4444";
  const scoreLabel = (s) => s >= 75 ? "Strong" : s >= 50 ? "Moderate" : "Weak";

  if (loading) return (
    <div style={{ background: "#F7F9FC", minHeight: "calc(100vh - 60px)" }} className="flex items-center justify-center">
      <div className="text-slate-400 text-sm">Loading history...</div>
    </div>
  );

  return (
    <div style={{ background: "#F7F9FC", minHeight: "calc(100vh - 60px)" }} className="py-10 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-1">Your analyses</p>
          <h1 className="text-3xl font-bold text-slate-900">History</h1>
          <p className="text-slate-500 text-sm mt-1">{history.length} resume{history.length !== 1 ? "s" : ""} analyzed</p>
        </div>

        {history.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
            <div className="text-4xl mb-3">📄</div>
            <p className="text-slate-600 font-medium mb-1">No analyses yet</p>
            <p className="text-slate-400 text-sm mb-4">Upload a resume to get your first ATS score</p>
            <Link to="/" style={{ background: "#0F1B2D" }} className="inline-block text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:opacity-90 transition-opacity">
              Analyze a Resume →
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {history.map((item) => (
              <div key={item._id} className="bg-white rounded-2xl border border-slate-200 p-5 flex gap-4 items-start hover:shadow-sm transition-shadow">
                <div className="flex flex-col items-center justify-center w-16 h-16 rounded-xl flex-shrink-0"
                  style={{ background: scoreColor(item.result.atsScore) + "15" }}>
                  <span style={{ color: scoreColor(item.result.atsScore) }} className="text-xl font-bold">{item.result.atsScore}</span>
                  <span style={{ color: scoreColor(item.result.atsScore) }} className="text-xs font-semibold">{scoreLabel(item.result.atsScore)}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <p className="text-sm font-semibold text-slate-800 truncate">{item.fileName}</p>
                    <p className="text-xs text-slate-400 flex-shrink-0">{new Date(item.createdAt).toLocaleDateString("en-PK", { day: "numeric", month: "short", year: "numeric" })}</p>
                  </div>
                  {item.jobDescription && (
                    <p className="text-xs text-teal-600 mb-1.5 font-medium truncate">Matched against: {item.jobDescription.slice(0, 50)}...</p>
                  )}
                  <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">{item.result.summary}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
