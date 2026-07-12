import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (!data.success) { setError(data.message); return; }
      login(data.token, data.user);
      navigate("/");
    } catch {
      setError("Could not reach server.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ background: "#F7F9FC", minHeight: "calc(100vh - 60px)" }} className="flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Create account</h1>
          <p className="text-slate-500 text-sm mt-1">Start analyzing your resume for free</p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 space-y-5">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-widest text-slate-500 mb-2">Full Name</label>
            <input name="name" value={form.name} onChange={handleChange}
              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 transition-colors"
              placeholder="Arisha Tariq" required />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-widest text-slate-500 mb-2">Email</label>
            <input type="email" name="email" value={form.email} onChange={handleChange}
              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 transition-colors"
              placeholder="you@example.com" required />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-widest text-slate-500 mb-2">Password</label>
            <input type="password" name="password" value={form.password} onChange={handleChange}
              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 transition-colors"
              placeholder="••••••••" required />
          </div>
          {error && <div className="bg-red-50 border border-red-100 rounded-lg px-4 py-3 text-sm text-red-600">{error}</div>}
          <button type="submit" onClick={handleSubmit} disabled={loading}
            style={{ background: "#0F1B2D" }}
            className="w-full text-white font-semibold py-3 rounded-xl transition-all text-sm hover:opacity-90 disabled:opacity-50">
            {loading ? "Creating account..." : "Create Account →"}
          </button>
          <p className="text-sm text-center text-slate-400">
            Already have an account?{" "}
            <Link to="/login" style={{ color: "#00C2A8" }} className="font-semibold hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
