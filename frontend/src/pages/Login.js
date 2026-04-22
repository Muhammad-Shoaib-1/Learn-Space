import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const login = async () => {
    if (!email.trim() || !password.trim()) return;

    setLoading(true);

    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });

      const token = res.data.token;

      // Save token
      localStorage.setItem("token", token);

      // Decode user (for future use)
      const decoded = JSON.parse(atob(token.split(".")[1]));
      localStorage.setItem("user", JSON.stringify(decoded));

      alert("Login successful");

      // Redirect (no reload)
      navigate("/dashboard");

    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = email.trim() && password.trim();

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

              {/* ── LOGO ── */}
              <div className="text-center mb-4">
                <div
                  className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-2"
                  style={{ width: 50, height: 50 }}
                >
                  📚
                </div>
                <h4 className="fw-bold text-primary mb-0">LearnSpace</h4>
                <p className="text-muted small">Welcome back! Ready to learn?</p>
              </div>

              {/* ── CARD ── */}
              <div className="card border-0 shadow-sm rounded-4 overflow-hidden">

                <div className="bg-primary" style={{ height: 5 }} />

                <div className="card-body p-4 p-md-5">

                  <h4 className="fw-bold text-dark mb-1">Sign in</h4>
                  <p className="text-muted small mb-4">
                    Enter your credentials to continue
                  </p>

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
                        onKeyDown={(e) => e.key === "Enter" && login()}
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
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && login()}
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
                        isFormValid ? "btn-primary" : "btn-secondary"
                      }`}
                      onClick={login}
                      disabled={!isFormValid || loading}
                    >
                      {loading ? "Signing in..." : "Sign In →"}
                    </button>
                  </div>

                  {/* DIVIDER */}
                  <div className="d-flex align-items-center gap-2 my-3">
                    <hr className="flex-grow-1 my-0" />
                    <span className="text-muted small">or</span>
                    <hr className="flex-grow-1 my-0" />
                  </div>

                  {/* REGISTER */}
                  <div className="d-grid">
                    <Link
                      to="/register"
                      className="btn btn-outline-secondary rounded-3 fw-semibold text-decoration-none"
                    >
                      Create a new account
                    </Link>
                  </div>

                </div>
              </div>

              {/* FOOTER */}
              <p className="text-center text-muted small mt-3 mb-0">
                Protected by industry-standard encryption 🔐
              </p>

            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;