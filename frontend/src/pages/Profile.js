import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

const BASE = "http://localhost:5000/api";

function Profile() {
  const [user, setUser] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  // Edit name form
  const [name, setName] = useState("");

  // Change password form
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    if (!token) { toast.error("Please login"); return; }
    try {
      const decoded = JSON.parse(atob(token.split(".")[1]));
      setUser(decoded);
      setName(decoded.name || "");

      // Fetch courses for stats
      const url = decoded.role === "student"
        ? `${BASE}/enroll/my-courses`
        : `${BASE}/courses/my-courses`;

      axios.get(url, { headers })
        .then((res) => { setCourses(res.data || []); setLoading(false); })
        .catch(() => { setCourses([]); setLoading(false); });
    } catch {
      toast.error("Invalid session");
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getInitials = (n = "") =>
    n.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);

  const avgProgress = user?.role === "student" && courses.length > 0
    ? Math.round(courses.reduce((a, c) => a + (c.progress || 0), 0) / courses.length)
    : 0;

  const completedCourses = courses.filter((c) => c.progress === 100).length;

  // ── Save profile (name) ──
  const handleSaveProfile = async () => {
    if (!name.trim()) { toast.warning("Name cannot be empty"); return; }
    if (name.trim() === user.name) { toast.info("No changes to save"); return; }

    setSavingProfile(true);
    try {
      const { data } = await axios.put(
        `${BASE}/auth/profile`,
        { name: name.trim() },
        { headers }
      );
      // Save new token with updated name
      localStorage.setItem("token", data.token);
      setUser(data.user);
      toast.success("Name updated successfully ✅");
    } catch (err) {
      toast.error(err.response?.data?.message || "Error updating profile");
    }
    setSavingProfile(false);
  };

  // ── Change password ──
  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.warning("Please fill all password fields");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setSavingPassword(true);
    try {
      await axios.put(
        `${BASE}/auth/profile`,
        { currentPassword, newPassword },
        { headers }
      );
      toast.success("Password changed successfully ✅");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      toast.error(err.response?.data?.message || "Error changing password");
    }
    setSavingPassword(false);
  };

  if (loading) {
    return (
      <div className="min-vh-100 bg-light d-flex align-items-center justify-content-center">
        <div className="spinner-border text-primary" style={{ width: 48, height: 48 }} />
      </div>
    );
  }

  return (
    <div className="bg-light min-vh-100">
      <div className="container py-5">

        {/* ── PAGE HEADER ── */}
        <motion.div className="mb-4" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <span className="badge bg-primary bg-opacity-10 text-primary rounded-pill px-3 py-2 fw-semibold small mb-2 d-inline-block">
            👤 My Profile
          </span>
          <h2 className="fw-bold display-6 text-dark mb-0">Account Settings</h2>
          <p className="text-muted mt-1">Manage your personal information and password.</p>
        </motion.div>

        <div className="row g-4">

          {/* ── LEFT COLUMN ── */}
          <div className="col-lg-4">

            {/* Profile Card */}
            <motion.div className="card border-0 shadow-sm rounded-4 mb-4 overflow-hidden"
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}>
              <div className="bg-primary py-4 text-center">
                <div
                  className="rounded-circle bg-white text-primary d-flex align-items-center justify-content-center fw-bold mx-auto"
                  style={{ width: 80, height: 80, fontSize: 28 }}
                >
                  {getInitials(user?.name)}
                </div>
              </div>
              <div className="card-body p-4 text-center">
                <h5 className="fw-bold text-dark mb-1">{user?.name}</h5>
                <p className="text-muted small mb-2">{user?.email}</p>
                <span className={`badge rounded-pill fw-semibold px-3 py-2 ${
                  user?.role === "admin" ? "bg-danger bg-opacity-10 text-danger"
                  : user?.role === "instructor" ? "bg-warning bg-opacity-25 text-warning"
                  : "bg-primary bg-opacity-10 text-primary"
                }`}>
                  {user?.role === "admin" ? "🛡️" : user?.role === "instructor" ? "🧑‍🏫" : "🎓"}{" "}
                  {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}
                </span>

                <hr className="my-3" />

                <ul className="list-unstyled text-start mb-0">
                  {[
                    { label: "Email", value: user?.email },
                    { label: "Role",  value: user?.role  },
                    { label: "Member since", value: new Date(
                        JSON.parse(atob(token.split(".")[1])).iat * 1000
                      ).toLocaleDateString("en-PK", { month: "short", year: "numeric" })
                    },
                  ].map((item, i) => (
                    <li key={i} className="d-flex justify-content-between py-2 border-bottom">
                      <span className="text-muted small">{item.label}</span>
                      <span className="fw-semibold small text-dark text-end" style={{ maxWidth: "60%" }}>{item.value}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>

            {/* Stats Card */}
            <motion.div className="card border-0 shadow-sm rounded-4"
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }}>
              <div className="card-body p-4">
                <h6 className="fw-bold text-dark mb-3">📊 Stats</h6>
                <div className="d-flex flex-column gap-3">

                  <div className="d-flex align-items-center justify-content-between p-3 rounded-3 bg-primary bg-opacity-10">
                    <div className="d-flex align-items-center gap-2">
                      <span className="fs-5">📚</span>
                      <span className="small fw-semibold text-dark">
                        {user?.role === "student" ? "Enrolled" : "Created"} Courses
                      </span>
                    </div>
                    <span className="fw-bold text-primary fs-5">{courses.length}</span>
                  </div>

                  {user?.role === "student" && (
                    <>
                      <div className="d-flex align-items-center justify-content-between p-3 rounded-3 bg-success bg-opacity-10">
                        <div className="d-flex align-items-center gap-2">
                          <span className="fs-5">✅</span>
                          <span className="small fw-semibold text-dark">Completed</span>
                        </div>
                        <span className="fw-bold text-success fs-5">{completedCourses}</span>
                      </div>

                      <div className="d-flex align-items-center justify-content-between p-3 rounded-3 bg-warning bg-opacity-10">
                        <div className="d-flex align-items-center gap-2">
                          <span className="fs-5">📈</span>
                          <span className="small fw-semibold text-dark">Avg Progress</span>
                        </div>
                        <span className="fw-bold text-warning fs-5">{avgProgress}%</span>
                      </div>
                    </>
                  )}

                </div>
              </div>
            </motion.div>

          </div>

          {/* ── RIGHT COLUMN ── */}
          <div className="col-lg-8">

            {/* Edit Name */}
            <motion.div className="card border-0 shadow-sm rounded-4 mb-4 overflow-hidden"
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.15 }}>
              <div className="bg-primary" style={{ height: 5 }} />
              <div className="card-body p-4">
                <h6 className="fw-bold text-dark mb-1">✏️ Edit Name</h6>
                <p className="text-muted small mb-4">Update your display name across the platform.</p>

                <div className="mb-3">
                  <label className="form-label fw-semibold text-dark small text-uppercase">Full Name</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-end-0 rounded-start-3">👤</span>
                    <input
                      type="text"
                      className="form-control border-start-0 rounded-end-3"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your full name"
                      onKeyDown={(e) => e.key === "Enter" && handleSaveProfile()}
                    />
                  </div>
                </div>

                <button
                  className="btn btn-primary rounded-3 fw-semibold px-4"
                  onClick={handleSaveProfile}
                  disabled={savingProfile}
                >
                  {savingProfile
                    ? <><span className="spinner-border spinner-border-sm me-2" />Saving...</>
                    : "Save Name"}
                </button>
              </div>
            </motion.div>

            {/* Change Password */}
            <motion.div className="card border-0 shadow-sm rounded-4 overflow-hidden"
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.25 }}>
              <div className="bg-warning" style={{ height: 5 }} />
              <div className="card-body p-4">
                <h6 className="fw-bold text-dark mb-1">🔒 Change Password</h6>
                <p className="text-muted small mb-4">Make sure your account stays secure.</p>

                {/* Current Password */}
                <div className="mb-3">
                  <label className="form-label fw-semibold text-dark small text-uppercase">Current Password</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-end-0 rounded-start-3">🔑</span>
                    <input
                      type={showCurrent ? "text" : "password"}
                      className="form-control border-start-0 border-end-0"
                      placeholder="Enter current password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                    />
                    <button className="input-group-text bg-light border-start-0 rounded-end-3"
                      onClick={() => setShowCurrent(!showCurrent)} type="button">
                      {showCurrent ? "🙈" : "👁️"}
                    </button>
                  </div>
                </div>

                {/* New Password */}
                <div className="mb-3">
                  <label className="form-label fw-semibold text-dark small text-uppercase">New Password</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-end-0 rounded-start-3">🔒</span>
                    <input
                      type={showNew ? "text" : "password"}
                      className="form-control border-start-0 border-end-0"
                      placeholder="Enter new password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                    <button className="input-group-text bg-light border-start-0 rounded-end-3"
                      onClick={() => setShowNew(!showNew)} type="button">
                      {showNew ? "🙈" : "👁️"}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="mb-4">
                  <label className="form-label fw-semibold text-dark small text-uppercase">Confirm New Password</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-end-0 rounded-start-3">🔒</span>
                    <input
                      type={showConfirm ? "text" : "password"}
                      className={`form-control border-start-0 border-end-0 ${
                        confirmPassword && newPassword !== confirmPassword ? "is-invalid" : ""
                      }`}
                      placeholder="Confirm new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <button className="input-group-text bg-light border-start-0 rounded-end-3"
                      onClick={() => setShowConfirm(!showConfirm)} type="button">
                      {showConfirm ? "🙈" : "👁️"}
                    </button>
                  </div>
                  {confirmPassword && newPassword !== confirmPassword && (
                    <div className="text-danger small mt-1">⚠️ Passwords do not match</div>
                  )}
                </div>

                <button
                  className="btn btn-warning text-dark rounded-3 fw-semibold px-4"
                  onClick={handleChangePassword}
                  disabled={savingPassword}
                >
                  {savingPassword
                    ? <><span className="spinner-border spinner-border-sm me-2" />Updating...</>
                    : "🔒 Change Password"}
                </button>
              </div>
            </motion.div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;