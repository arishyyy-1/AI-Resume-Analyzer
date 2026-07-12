import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  const isActive = (path) => location.pathname === path;

  return (
    <nav style={{ background: "#0F1B2D" }} className="px-6 py-4 flex items-center justify-between sticky top-0 z-50">
      <Link to="/" className="flex items-center gap-2">
        <span style={{ color: "#00C2A8" }} className="text-xl font-bold tracking-tight">Resume</span>
        <span className="text-white text-xl font-light tracking-tight">AI</span>
      </Link>

      {user ? (
        <div className="flex items-center gap-6">
          <Link to="/"
            style={{ color: isActive("/") ? "#00C2A8" : "#94A3B8" }}
            className="text-sm font-medium hover:text-white transition-colors">
            Analyze
          </Link>
          <Link to="/history"
            style={{ color: isActive("/history") ? "#00C2A8" : "#94A3B8" }}
            className="text-sm font-medium hover:text-white transition-colors">
            History
          </Link>
          <div className="flex items-center gap-3 pl-4 border-l border-slate-700">
            <div style={{ background: "#00C2A8" }} className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <span className="text-sm text-slate-300 hidden sm:block">{user.name}</span>
            <button onClick={handleLogout}
              className="text-xs text-slate-400 hover:text-white border border-slate-600 hover:border-slate-400 px-3 py-1.5 rounded-lg transition-all">
              Logout
            </button>
          </div>
        </div>
      ) : (
        <div className="flex gap-3">
          <Link to="/login" className="text-sm text-slate-300 hover:text-white transition-colors px-3 py-1.5">Login</Link>
          <Link to="/register"
            style={{ background: "#00C2A8" }}
            className="text-sm text-white font-medium px-4 py-1.5 rounded-lg hover:opacity-90 transition-opacity">
            Register
          </Link>
        </div>
      )}
    </nav>
  );
}
