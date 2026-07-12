import React, { useEffect, useRef } from "react";

function ScoreRing({ score }) {
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 75 ? "#00C2A8" : score >= 50 ? "#F59E0B" : "#EF4444";
  const label = score >= 75 ? "Strong Match" : score >= 50 ? "Moderate Match" : "Needs Work";

  return (
    <div className="flex flex-col items-center justify-center gap-2">
      <svg width="130" height="130" viewBox="0 0 130 130">
        <circle cx="65" cy="65" r={radius} fill="none" stroke="#1E2D40" strokeWidth="10" />
        <circle cx="65" cy="65" r={radius} fill="none" stroke={color} strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform="rotate(-90 65 65)"
          style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1)" }}
        />
        <text x="65" y="60" textAnchor="middle" fill="white" fontSize="26" fontWeight="700" fontFamily="Inter">{score}</text>
        <text x="65" y="78" textAnchor="middle" fill="#64748B" fontSize="10" fontFamily="Inter">/100</text>
      </svg>
      <span style={{ color }} className="text-xs font-semibold uppercase tracking-widest">{label}</span>
    </div>
  );
}

function Card({ title, items, borderColor, dotColor }) {
  if (!items || items.length === 0) return null;
  return (
    <div style={{ borderLeftColor: borderColor }} className="bg-white rounded-xl p-5 border-l-4 shadow-sm">
      <h3 style={{ color: borderColor }} className="text-xs font-bold uppercase tracking-widest mb-3">{title}</h3>
      <ul className="space-y-2">
        {items.map((item, i) => (
          <li key={i} className="flex gap-2.5 text-sm text-slate-700 leading-relaxed">
            <span style={{ color: dotColor, marginTop: "2px", flexShrink: 0 }}>▸</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function AnalysisResult({ analysis }) {
  if (!analysis) return null;

  return (
    <div className="mt-8 space-y-4">
      {/* Score + Summary hero */}
      <div style={{ background: "#0F1B2D" }} className="rounded-2xl p-6 flex flex-col sm:flex-row gap-6 items-center">
        <ScoreRing score={analysis.atsScore} />
        <div className="flex-1">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-2">Overall Assessment</p>
          <p className="text-slate-200 text-sm leading-relaxed">{analysis.summary}</p>
        </div>
      </div>

      {/* Cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card title="ATS Issues" items={analysis.atsIssues} borderColor="#EF4444" dotColor="#EF4444" />
        <Card title="Strengths" items={analysis.strengths} borderColor="#00C2A8" dotColor="#00C2A8" />
        <Card title="Skill Gaps" items={analysis.skillGaps} borderColor="#F59E0B" dotColor="#F59E0B" />
        <Card title="Recommendations" items={analysis.recommendations} borderColor="#6366F1" dotColor="#6366F1" />
      </div>
    </div>
  );
}
