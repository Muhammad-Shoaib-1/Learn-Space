import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Courses from "./pages/Courses";
import CreateCourse from "./pages/CreateCourse";
import Dashboard from "./pages/Dashboard";

function Navbar({ role, logout }) {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom shadow-sm sticky-top">
      <div className="container">

        {/* ── BRAND ── */}
        <Link className="navbar-brand fw-bold fs-4 text-primary text-decoration-none d-flex align-items-center gap-2" to="/">
          <span className="bg-primary text-white rounded-2 px-2 py-1 small">LS</span>
          LearnSpace
        </Link>

        {/* ── HAMBURGER ── */}
        <button
          className="navbar-toggler border-0"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon" />
        </button>

        {/* ── NAV LINKS ── */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 ms-3">

            <li className="nav-item">
              <Link
                to="/"
                className={`nav-link fw-semibold px-3 rounded-3 me-1 ${isActive("/") ? "bg-primary bg-opacity-10 text-primary" : "text-secondary"}`}
              >
                📖 Courses
              </Link>
            </li>

            {role && (
              <li className="nav-item">
                <Link
                  to="/dashboard"
                  className={`nav-link fw-semibold px-3 rounded-3 me-1 ${isActive("/dashboard") ? "bg-primary bg-opacity-10 text-primary" : "text-secondary"}`}
                >
                  📊 Dashboard
                </Link>
              </li>
            )}

            {role === "instructor" && (
              <li className="nav-item">
                <Link
                  to="/create-course"
                  className={`nav-link fw-semibold px-3 rounded-3 me-1 ${isActive("/create-course") ? "bg-warning bg-opacity-25 text-warning" : "text-secondary"}`}
                >
                  ✏️ Create Course
                </Link>
              </li>
            )}

          </ul>

          {/* ── RIGHT SIDE ── */}
          <div className="d-flex align-items-center gap-2 flex-wrap">

            {/* Role badge */}
            {role && (
              <span className={`badge rounded-pill px-3 py-2 fw-semibold ${role === "instructor" ? "bg-warning text-dark" : "bg-primary bg-opacity-10 text-primary"}`}>
                {role === "instructor" ? "🧑‍🏫" : "🎓"} {role.charAt(0).toUpperCase() + role.slice(1)}
              </span>
            )}

            {!role && (
              <>
                <Link to="/login" className="btn btn-outline-primary rounded-3 fw-semibold px-3">
                  Sign In
                </Link>
                <Link to="/register" className="btn btn-primary rounded-3 fw-semibold px-3">
                  Register
                </Link>
              </>
            )}

            {role && (
              <button className="btn btn-outline-danger rounded-3 fw-semibold px-3" onClick={logout}>
                Sign Out
              </button>
            )}

          </div>
        </div>
      </div>
    </nav>
  );
}

function App() {
  const [role, setRole] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = JSON.parse(atob(token.split(".")[1]));
        setRole(decoded.role);
      } catch (err) {
        console.log("Invalid token");
      }
    }
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <Router>
      <Navbar role={role} logout={logout} />
      <Routes>
        <Route path="/" element={<Courses />} />
        <Route path="/create-course" element={<CreateCourse />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;