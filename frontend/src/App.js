import React, { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation,
} from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Courses from "./pages/Courses";
import CourseDetail from "./pages/CourseDetail";
import CreateCourse from "./pages/CreateCourse";
import Dashboard from "./pages/Dashboard";
import AdminPanel from "./pages/AdminPanel";
import ManageLessons from "./pages/ManageLessons";
import Profile from "./pages/Profile";
import About from "./pages/About";

function Navbar({ role, logout }) {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom shadow-sm sticky-top">
      <div className="container">

        <Link
          className="navbar-brand fw-bold fs-4 text-primary text-decoration-none d-flex align-items-center gap-2"
          to="/"
        >
          <span className="bg-primary text-white rounded-2 px-2 py-1 small">LS</span>
          LearnSpace
        </Link>

        <button
          className="navbar-toggler border-0"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 ms-3">

            <li className="nav-item">
              <Link to="/" className={`nav-link fw-semibold px-3 rounded-3 me-1 ${isActive("/") ? "bg-primary bg-opacity-10 text-primary" : "text-secondary"}`}>
                🏠 Home
              </Link>
            </li>

            <li className="nav-item">
              <Link to="/courses" className={`nav-link fw-semibold px-3 rounded-3 me-1 ${isActive("/courses") ? "bg-primary bg-opacity-10 text-primary" : "text-secondary"}`}>
                📖 Courses
              </Link>
            </li>

            <li className="nav-item">
              <Link to="/about"
                className={`nav-link fw-semibold px-3 rounded-3 me-1 ${
                  isActive("/about") ? "bg-primary bg-opacity-10 text-primary" : "text-secondary"
                }`}>
                ℹ️ About
              </Link>
            </li>

            {role && (
              <li className="nav-item">
                <Link to="/profile"
                  className={`nav-link fw-semibold px-3 rounded-3 me-1 ${
                  isActive("/profile") ? "bg-primary bg-opacity-10 text-primary" : "text-secondary"
                  }`}>
                  👤 Profile
                </Link>
              </li>
            )}

            {(role === "student" || role === "instructor") && (
              <li className="nav-item">
                <Link to="/dashboard" className={`nav-link fw-semibold px-3 rounded-3 me-1 ${isActive("/dashboard") ? "bg-primary bg-opacity-10 text-primary" : "text-secondary"}`}>
                  📊 Dashboard
                </Link>
              </li>
            )}

            {role === "instructor" && (
              <li className="nav-item">
                <Link to="/create-course" className={`nav-link fw-semibold px-3 rounded-3 me-1 ${isActive("/create-course") ? "bg-warning bg-opacity-25 text-warning" : "text-secondary"}`}>
                  ✏️ Create Course
                </Link>
              </li>
            )}

            {role === "admin" && (
              <li className="nav-item">
                <Link to="/admin" className={`nav-link fw-semibold px-3 rounded-3 me-1 ${isActive("/admin") ? "bg-danger bg-opacity-10 text-danger" : "text-secondary"}`}>
                  🛡️ Admin
                </Link>
              </li>
            )}

          </ul>

          <div className="d-flex align-items-center gap-2 flex-wrap">
            {role && (
              <span className={`badge rounded-pill px-3 py-2 fw-semibold ${
                role === "admin" ? "bg-danger bg-opacity-10 text-danger"
                : role === "instructor" ? "bg-warning text-dark"
                : "bg-primary bg-opacity-10 text-primary"
              }`}>
                {role === "admin" ? "🛡️" : role === "instructor" ? "🧑‍🏫" : "🎓"}{" "}
                {role.charAt(0).toUpperCase() + role.slice(1)}
              </span>
            )}

            {!role && (
              <>
                <Link to="/login" className="btn btn-outline-primary rounded-3 fw-semibold px-3">Sign In</Link>
                <Link to="/register" className="btn btn-primary rounded-3 fw-semibold px-3">Register</Link>
              </>
            )}

            {role && (
              <button className="btn btn-outline-danger rounded-3 fw-semibold px-3" onClick={logout}>
                Sign Out
              </button>
            )}
          </div>
        </div>

        <ToastContainer position="top-right" autoClose={2500} hideProgressBar={false} newestOnTop closeOnClick pauseOnHover theme="colored" />
      </div>
    </nav>
  );
}

function App() {
  const [role, setRole] = useState("");

  const loadUserFromToken = () => {
    const token = localStorage.getItem("token");
    if (!token) { setRole(""); return; }
    try {
      const decoded = JSON.parse(atob(token.split(".")[1]));
      setRole(decoded.role);
    } catch (err) {
      setRole("");
    }
  };

  useEffect(() => {
    loadUserFromToken();
    window.addEventListener("focus", loadUserFromToken);
    return () => window.removeEventListener("focus", loadUserFromToken);
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    setRole("");
    window.location.href = "/login";
  };

  return (
    <Router>
      <Navbar role={role} logout={logout} />
      <Routes>
        <Route path="/"               element={<Home />}         />
        <Route path="/courses"        element={<Courses />}      />
        <Route path="/courses/:id"    element={<CourseDetail />} />
        <Route path="/create-course"  element={<CreateCourse />} />
        <Route path="/login"          element={<Login />}        />
        <Route path="/register"       element={<Register />}     />
        <Route path="/dashboard"      element={<Dashboard />}    />
        <Route path="/admin"          element={<AdminPanel />}   />
        <Route path="/manage-lessons/:courseId" element={<ManageLessons />} />
        <Route path="/profile"        element={<Profile />} />
        <Route path="/about"          element={<About />} />
      </Routes>
    </Router>
  );
}

export default App;