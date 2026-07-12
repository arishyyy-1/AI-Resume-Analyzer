import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
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
          <h1 className="text-3xl font-bold text-slate-900">Welcome back</h1>
          <p className="text-slate-500 text-sm mt-1">Sign in to access your resume analyses</p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 space-y-5">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-widest text-slate-500 mb-2">Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 transition-colors"
              placeholder="you@example.com" required />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-widest text-slate-500 mb-2">Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)}
              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 transition-colors"
              placeholder="••••••••" required />
          </div>
          {error && <div className="bg-red-50 border border-red-100 rounded-lg px-4 py-3 text-sm text-red-600">{error}</div>}
          <button type="submit" onClick={handleSubmit} disabled={loading}
            style={{ background: "#0F1B2D" }}
            className="w-full text-white font-semibold py-3 rounded-xl transition-all text-sm hover:opacity-90 disabled:opacity-50">
            {loading ? "Signing in..." : "Sign In →"}
          </button>
          <p className="text-sm text-center text-slate-400">
            Don't have an account?{" "}
            <Link to="/register" style={{ color: "#00C2A8" }} className="font-semibold hover:underline">Register</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
