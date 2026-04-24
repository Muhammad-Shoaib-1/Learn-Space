import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const register = async () => {
    if (!name.trim() || !email.trim() || !password.trim()) return;

    setLoading(true);

    try {
      await axios.post("http://localhost:5000/api/auth/register", {
        name,
        email,
        password,
        role,
      });

      toast.success("Registered Successfully");

      navigate("/login");

    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = name.trim() && email.trim() && password.trim();

  return (
    <div className="min-vh-100 bg-light d-flex align-items-center justify-content-center py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-5 col-md-7 col-sm-10">

            <motion.div
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >

              {/* LOGO */}
              <div className="text-center mb-4">
                <div
                  className="bg-success text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-2"
                  style={{ width: 50, height: 50 }}
                >
                  📚
                </div>
                <h4 className="fw-bold text-primary mb-0">LearnSpace</h4>
                <p className="text-muted small">Your gateway to knowledge</p>
              </div>

              {/* CARD */}
              <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
                <div className="bg-success" style={{ height: 5 }} />

                <div className="card-body p-4 p-md-5">

                  <h4 className="fw-bold text-dark mb-1">Create an account</h4>
                  <p className="text-muted small mb-4">
                    Join thousands of learners today
                  </p>

                  {/* ROLE */}
                  <div className="mb-4">
                    <label className="form-label fw-semibold text-dark small text-uppercase">
                      I am a
                    </label>
                    <div className="d-flex gap-2">
                      <button
                        type="button"
                        className={`btn flex-fill rounded-3 fw-semibold ${
                          role === "student"
                            ? "btn-primary"
                            : "btn-outline-secondary"
                        }`}
                        onClick={() => setRole("student")}
                      >
                        🎓 Student
                      </button>

                      <button
                        type="button"
                        className={`btn flex-fill rounded-3 fw-semibold ${
                          role === "instructor"
                            ? "btn-warning text-dark"
                            : "btn-outline-secondary"
                        }`}
                        onClick={() => setRole("instructor")}
                      >
                        🧑‍🏫 Instructor
                      </button>
                    </div>
                  </div>

                  {/* NAME */}
                  <div className="mb-3">
                    <label className="form-label fw-semibold text-dark small text-uppercase">
                      Full Name
                    </label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-end-0 rounded-start-3">
                        👤
                      </span>
                      <input
                        className="form-control border-start-0 rounded-end-3"
                        placeholder="John Doe"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* EMAIL */}
                  <div className="mb-3">
                    <label className="form-label fw-semibold text-dark small text-uppercase">
                      Email Address
                    </label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-end-0 rounded-start-3">
                        ✉️
                      </span>
                      <input
                        type="email"
                        className="form-control border-start-0 rounded-end-3"
                        placeholder="john@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* PASSWORD */}
                  <div className="mb-4">
                    <label className="form-label fw-semibold text-dark small text-uppercase">
                      Password
                    </label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-end-0 rounded-start-3">
                        🔒
                      </span>
                      <input
                        type={showPassword ? "text" : "password"}
                        className="form-control border-start-0 border-end-0"
                        placeholder="Create a strong password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      <button
                        type="button"
                        className="input-group-text bg-light border-start-0 rounded-end-3"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? "🙈" : "👁️"}
                      </button>
                    </div>
                  </div>

                  {/* SUBMIT */}
                  <div className="d-grid mb-3">
                    <button
                      className={`btn btn-lg rounded-3 fw-semibold ${
                        isFormValid ? "btn-success" : "btn-secondary"
                      }`}
                      onClick={register}
                      disabled={!isFormValid || loading}
                    >
                      {loading ? "Creating account..." : "🚀 Create Account"}
                    </button>
                  </div>

                  {/* LOGIN LINK */}
                  <p className="text-center text-muted small mb-0">
                    Already have an account?{" "}
                    <Link
                      to="/login"
                      className="text-primary fw-semibold text-decoration-none"
                    >
                      Sign in →
                    </Link>
                  </p>

                </div>
              </div>

              {/* FOOTER */}
              <p className="text-center text-muted small mt-3 mb-0">
                By registering, you agree to our{" "}
                <span className="text-decoration-underline">Terms</span> &{" "}
                <span className="text-decoration-underline">Privacy Policy</span>
              </p>

            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;