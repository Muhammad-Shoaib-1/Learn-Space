import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

const BASE = "http://localhost:5000/api/admin";

function AdminPanel() {
  const [tab, setTab] = useState("analytics");
  const [analytics, setAnalytics] = useState(null);
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userSearch, setUserSearch] = useState("");
  const [courseSearch, setCourseSearch] = useState("");

  // ── password reset state per user ──
  const [pwdInputs, setPwdInputs] = useState({});    // { userId: "newpass" }
  const [pwdVisible, setPwdVisible] = useState({});  // { userId: true/false }
  const [pwdLoading, setPwdLoading] = useState({});  // { userId: true/false }

  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  const adminUser = (() => {
    try { return JSON.parse(atob(token.split(".")[1])); }
    catch { return null; }
  })();
  const role = adminUser?.role || "";

  useEffect(() => {
    if (role !== "admin") return;
    fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [aRes, uRes, cRes] = await Promise.all([
        axios.get(`${BASE}/analytics`, { headers }),
        axios.get(`${BASE}/users`, { headers }),
        axios.get(`${BASE}/courses`, { headers }),
      ]);
      setAnalytics(aRes.data);
      setUsers(uRes.data);
      setCourses(cRes.data);
    } catch (err) {
      toast.error("Error loading admin data");
    }
    setLoading(false);
  };

  const deleteUser = async (id, name) => {
    if (!window.confirm(`Delete user "${name}"?`)) return;
    try {
      await axios.delete(`${BASE}/users/${id}`, { headers });
      setUsers(users.filter((u) => u._id !== id));
      toast.success("User deleted");
    } catch (err) {
      toast.error(err.response?.data?.message || "Error deleting user");
    }
  };

  // ── Reset password handler ──
  const resetPassword = async (userId, userName) => {
    const newPassword = pwdInputs[userId]?.trim();
    if (!newPassword || newPassword.length < 6) {
      toast.warning("Password must be at least 6 characters");
      return;
    }
    setPwdLoading((prev) => ({ ...prev, [userId]: true }));
    try {
      await axios.put(
        `${BASE}/users/${userId}/reset-password`,
        { newPassword },
        { headers }
      );
      toast.success(`Password updated for ${userName}`);
      // clear input after success
      setPwdInputs((prev) => ({ ...prev, [userId]: "" }));
    } catch (err) {
      toast.error(err.response?.data?.message || "Error resetting password");
    }
    setPwdLoading((prev) => ({ ...prev, [userId]: false }));
  };

  const deleteCourse = async (id, title) => {
    if (!window.confirm(`Delete course "${title}"?`)) return;
    try {
      await axios.delete(`${BASE}/courses/${id}`, { headers });
      setCourses(courses.filter((c) => c._id !== id));
      toast.success("Course deleted");
    } catch (err) {
      toast.error(err.response?.data?.message || "Error deleting course");
    }
  };

  const getInitials = (name = "") =>
    name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  const avatarColors = ["#0d6efd","#198754","#fd7e14","#6f42c1","#e83e8c","#20c997"];
  const avatarColor = (i) => avatarColors[i % avatarColors.length];

  const filteredUsers = users.filter((u) =>
    u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.email.toLowerCase().includes(userSearch.toLowerCase())
  );

  const filteredCourses = courses.filter((c) =>
    c.title.toLowerCase().includes(courseSearch.toLowerCase())
  );

  const maxMonthly = analytics
    ? Math.max(...Array.from({ length: 12 }, (_, i) => {
        const m = analytics.monthlyEnrollments.find((e) => e._id === i + 1);
        return m ? m.count : 0;
      }), 1)
    : 1;

  const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

  const greetingTime = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 18) return "Good afternoon";
    return "Good evening";
  };

  if (role !== "admin") {
    return (
      <div className="min-vh-100 bg-light d-flex align-items-center justify-content-center">
        <div className="text-center">
          <span className="fs-1">🚫</span>
          <h4 className="fw-bold mt-3">Access Denied</h4>
          <p className="text-muted">You must be an admin to view this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-light min-vh-100">
      <div className="container py-5">

        {/* ── HERO GREETING ── */}
        <motion.div className="mb-4" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <h2 className="fw-bold display-6 text-dark mb-1">
            {greetingTime()}{adminUser?.name ? `, ${adminUser.name.split(" ")[0]}` : ""} 👋
          </h2>
          <p className="text-muted mb-0">Welcome to your admin panel. Here's the full platform overview.</p>
        </motion.div>

        {/* ── ADMIN PROFILE CARD ── */}
        {adminUser && (
          <motion.div className="card border-0 shadow-sm rounded-4 mb-4" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}>
            <div className="card-body d-flex align-items-center gap-3 p-4">
              <div className="rounded-3 bg-danger text-white d-flex align-items-center justify-content-center fw-bold fs-5 flex-shrink-0" style={{ width: 52, height: 52 }}>
                {getInitials(adminUser.name)}
              </div>
              <div className="flex-grow-1">
                <h5 className="fw-bold mb-1 text-dark">{adminUser.name}</h5>
                <div className="d-flex flex-wrap gap-3">
                  <span className="text-muted small"><span className="fw-semibold text-secondary">Email:</span> {adminUser.email}</span>
                  <span className="text-muted small"><span className="fw-semibold text-secondary">Role:</span>{" "}
                    <span className="badge bg-danger bg-opacity-10 text-danger rounded-pill fw-semibold">🛡️ Admin</span>
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ── STAT CARDS ── */}
        {loading ? (
          <div className="text-center py-5"><div className="spinner-border text-primary" /></div>
        ) : (
          <>
            <motion.div className="row g-3 mb-4" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }}>
              {[
                { label: "Total Users",   value: analytics?.totalUsers,       color: "text-primary", icon: "👥" },
                { label: "Total Courses", value: analytics?.totalCourses,     color: "text-success", icon: "📚" },
                { label: "Enrollments",   value: analytics?.totalEnrollments, color: "text-warning", icon: "🎓" },
                { label: "Instructors",   value: analytics?.instructorCount,  color: "text-danger",  icon: "🧑‍🏫" },
              ].map((stat, i) => (
                <div className="col-6 col-md-3" key={i}>
                  <div className="card border-0 shadow-sm rounded-4 h-100">
                    <div className="card-body p-4">
                      <div className="fs-4 mb-2">{stat.icon}</div>
                      <p className="text-muted small text-uppercase fw-semibold mb-1">{stat.label}</p>
                      <h2 className={`fw-bold mb-0 ${stat.color}`}>{stat.value ?? 0}</h2>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>

            {/* ── TABS ── */}
            <div className="d-flex gap-2 mb-4 flex-wrap">
              {[
                { key: "analytics", label: "📈 Analytics" },
                { key: "users",     label: "👥 Users"     },
                { key: "courses",   label: "📚 Courses"   },
              ].map((t) => (
                <button
                  key={t.key}
                  className={`btn rounded-3 fw-semibold px-4 ${tab === t.key ? "btn-primary" : "btn-outline-secondary"}`}
                  onClick={() => setTab(t.key)}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* ════════ ANALYTICS TAB ════════ */}
            {tab === "analytics" && (
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                <div className="row g-4">
                  <div className="col-md-7">
                    <div className="card border-0 shadow-sm rounded-4 h-100">
                      <div className="card-body p-4">
                        <h6 className="fw-bold text-dark mb-3">📈 Monthly Enrollments</h6>
                        <div className="d-flex align-items-end gap-2" style={{ height: 120 }}>
                          {Array.from({ length: 12 }, (_, i) => {
                            const found = analytics?.monthlyEnrollments.find((e) => e._id === i + 1);
                            const count = found ? found.count : 0;
                            const pct = Math.round((count / maxMonthly) * 100);
                            return (
                              <div key={i} className="d-flex flex-column align-items-center flex-fill">
                                <small className="text-muted mb-1" style={{ fontSize: 10 }}>{count || ""}</small>
                                <div className="bg-primary rounded-top w-100" style={{ height: `${pct || 4}%`, minHeight: 4, opacity: 0.85 }} title={`${monthNames[i]}: ${count}`} />
                              </div>
                            );
                          })}
                        </div>
                        <div className="d-flex gap-2 mt-2">
                          {monthNames.map((m) => (
                            <div key={m} className="flex-fill text-center" style={{ fontSize: 10, color: "#aaa" }}>{m}</div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-5">
                    <div className="card border-0 shadow-sm rounded-4 h-100">
                      <div className="card-body p-4">
                        <h6 className="fw-bold text-dark mb-3">🏆 Top Courses</h6>
                        <div className="d-flex flex-column gap-3">
                          {analytics?.topCourses?.length === 0 && <p className="text-muted small">No enrollment data yet.</p>}
                          {analytics?.topCourses?.map((c, i) => {
                            const maxCount = analytics.topCourses[0]?.count || 1;
                            const pct = Math.round((c.count / maxCount) * 100);
                            const colors = ["bg-primary","bg-success","bg-warning","bg-danger","bg-info"];
                            return (
                              <div key={i}>
                                <div className="d-flex justify-content-between mb-1">
                                  <span className="small fw-semibold text-dark" style={{ fontSize: 13 }}>{c.title.length > 22 ? c.title.slice(0,22)+"…" : c.title}</span>
                                  <span className="small text-muted">{c.count} students</span>
                                </div>
                                <div className="progress rounded-pill" style={{ height: 7 }}>
                                  <div className={`progress-bar rounded-pill ${colors[i]}`} style={{ width: `${pct}%` }} />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-12">
                    <div className="card border-0 shadow-sm rounded-4">
                      <div className="card-body p-4">
                        <h6 className="fw-bold text-dark mb-3">👤 User Breakdown</h6>
                        <div className="row g-3">
                          {[
                            { icon: "🎓", label: "Students",    value: analytics?.studentCount,    color: "primary" },
                            { icon: "🧑‍🏫", label: "Instructors", value: analytics?.instructorCount, color: "warning" },
                            { icon: "🛡️", label: "Admins",      value: (analytics?.totalUsers ?? 0) - (analytics?.studentCount ?? 0) - (analytics?.instructorCount ?? 0), color: "danger" },
                          ].map((item, i) => (
                            <div className="col-md-4" key={i}>
                              <div className={`d-flex align-items-center gap-3 p-3 rounded-3 bg-${item.color} bg-opacity-10`}>
                                <span className="fs-4">{item.icon}</span>
                                <div>
                                  <div className={`fw-bold text-${item.color} fs-4`}>{item.value}</div>
                                  <div className="text-muted small">{item.label}</div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ════════ USERS TAB ════════ */}
            {tab === "users" && (
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                <div className="card border-0 shadow-sm rounded-4">
                  <div className="card-body p-4">

                    {/* Header */}
                    <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-3">
                      <h6 className="fw-bold text-dark mb-0">
                        👥 All Users <span className="badge bg-secondary rounded-pill ms-1">{filteredUsers.length}</span>
                      </h6>
                      <input
                        className="form-control form-control-sm rounded-3"
                        style={{ width: 230 }}
                        placeholder="Search by name or email..."
                        value={userSearch}
                        onChange={(e) => setUserSearch(e.target.value)}
                      />
                    </div>

                    {/* ⚠️ Note about passwords */}
                    <div className="alert alert-warning rounded-3 small py-2 px-3 mb-3 d-flex align-items-center gap-2">
                      <span>🔒</span>
                      <span>Passwords are <strong>hashed</strong> in the database and cannot be viewed. You can only <strong>set a new password</strong> for any user.</span>
                    </div>

                    <div className="table-responsive">
                      <table className="table align-middle mb-0">
                        <thead className="table-light">
                          <tr>
                            <th className="text-muted small text-uppercase fw-semibold">User</th>
                            <th className="text-muted small text-uppercase fw-semibold">Email</th>
                            <th className="text-muted small text-uppercase fw-semibold">Role</th>
                            <th className="text-muted small text-uppercase fw-semibold">Joined</th>
                            <th className="text-muted small text-uppercase fw-semibold" style={{ minWidth: 260 }}>Reset Password</th>
                            <th className="text-muted small text-uppercase fw-semibold">Delete</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredUsers.length === 0 && (
                            <tr><td colSpan={6} className="text-center text-muted py-4">No users found.</td></tr>
                          )}
                          {filteredUsers.map((u, i) => (
                            <tr key={u._id}>

                              {/* Name */}
                              <td>
                                <div className="d-flex align-items-center gap-2">
                                  <div className="rounded-3 text-white d-flex align-items-center justify-content-center fw-bold flex-shrink-0"
                                    style={{ width: 36, height: 36, fontSize: 13, background: avatarColor(i) }}>
                                    {getInitials(u.name)}
                                  </div>
                                  <span className="fw-semibold text-dark">{u.name}</span>
                                </div>
                              </td>

                              {/* Email */}
                              <td className="text-muted small">{u.email}</td>

                              {/* Role */}
                              <td>
                                <span className={`badge rounded-pill fw-semibold ${
                                  u.role === "admin"       ? "bg-danger bg-opacity-10 text-danger"
                                  : u.role === "instructor" ? "bg-warning bg-opacity-25 text-warning"
                                  : "bg-primary bg-opacity-10 text-primary"
                                }`}>
                                  {u.role === "admin" ? "🛡️" : u.role === "instructor" ? "🧑‍🏫" : "🎓"} {u.role}
                                </span>
                              </td>

                              {/* Joined */}
                              <td className="text-muted small">
                                {new Date(u.createdAt).toLocaleDateString("en-PK", { day: "numeric", month: "short", year: "numeric" })}
                              </td>

                              {/* ── RESET PASSWORD CELL ── */}
                              <td>
                                <div className="d-flex gap-2 align-items-center">
                                  <div className="input-group input-group-sm" style={{ maxWidth: 200 }}>
                                    <input
                                      type={pwdVisible[u._id] ? "text" : "password"}
                                      className="form-control rounded-start-3 border-end-0"
                                      placeholder="New password"
                                      value={pwdInputs[u._id] || ""}
                                      onChange={(e) =>
                                        setPwdInputs((prev) => ({ ...prev, [u._id]: e.target.value }))
                                      }
                                      onKeyDown={(e) => {
                                        if (e.key === "Enter") resetPassword(u._id, u.name);
                                      }}
                                    />
                                    {/* Show/hide toggle */}
                                    <button
                                      className="input-group-text bg-white border-start-0 rounded-end-3"
                                      style={{ cursor: "pointer" }}
                                      onClick={() =>
                                        setPwdVisible((prev) => ({ ...prev, [u._id]: !prev[u._id] }))
                                      }
                                      title={pwdVisible[u._id] ? "Hide" : "Show"}
                                    >
                                      {pwdVisible[u._id] ? "🙈" : "👁️"}
                                    </button>
                                  </div>

                                  {/* Save button */}
                                  <button
                                    className="btn btn-sm btn-outline-primary rounded-3 fw-semibold flex-shrink-0"
                                    onClick={() => resetPassword(u._id, u.name)}
                                    disabled={pwdLoading[u._id] || !pwdInputs[u._id]}
                                  >
                                    {pwdLoading[u._id] ? (
                                      <span className="spinner-border spinner-border-sm" />
                                    ) : "Save"}
                                  </button>
                                </div>
                              </td>

                              {/* Delete */}
                              <td>
                                <button
                                  className="btn btn-outline-danger btn-sm rounded-3 fw-semibold"
                                  onClick={() => deleteUser(u._id, u.name)}
                                >
                                  🗑️
                                </button>
                              </td>

                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ════════ COURSES TAB ════════ */}
            {tab === "courses" && (
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                <div className="card border-0 shadow-sm rounded-4">
                  <div className="card-body p-4">
                    <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-3">
                      <h6 className="fw-bold text-dark mb-0">
                        📚 All Courses <span className="badge bg-secondary rounded-pill ms-1">{filteredCourses.length}</span>
                      </h6>
                      <input
                        className="form-control form-control-sm rounded-3"
                        style={{ width: 230 }}
                        placeholder="Search courses..."
                        value={courseSearch}
                        onChange={(e) => setCourseSearch(e.target.value)}
                      />
                    </div>
                    <div className="table-responsive">
                      <table className="table align-middle mb-0">
                        <thead className="table-light">
                          <tr>
                            <th className="text-muted small text-uppercase fw-semibold">Course</th>
                            <th className="text-muted small text-uppercase fw-semibold">Instructor</th>
                            <th className="text-muted small text-uppercase fw-semibold">Category</th>
                            <th className="text-muted small text-uppercase fw-semibold">Price</th>
                            <th className="text-muted small text-uppercase fw-semibold">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredCourses.length === 0 && (
                            <tr><td colSpan={5} className="text-center text-muted py-4">No courses found.</td></tr>
                          )}
                          {filteredCourses.map((c) => (
                            <tr key={c._id}>
                              <td>
                                <div className="d-flex align-items-center gap-2">
                                  {c.image ? (
                                    <img src={c.image} alt={c.title} className="rounded-3 flex-shrink-0"
                                      style={{ width: 40, height: 40, objectFit: "cover" }}
                                      onError={(e) => e.currentTarget.style.display = "none"} />
                                  ) : (
                                    <div className="bg-primary bg-opacity-10 rounded-3 d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: 40, height: 40 }}>
                                      <span style={{ fontSize: 16 }}>📘</span>
                                    </div>
                                  )}
                                  <span className="fw-semibold text-dark">
                                    {c.title.length > 28 ? c.title.slice(0,28)+"…" : c.title}
                                  </span>
                                </div>
                              </td>
                              <td className="text-muted small">{c.instructor?.name || "—"}</td>
                              <td>
                                <span className="badge rounded-pill bg-primary bg-opacity-10 text-primary fw-semibold">
                                  {c.category || "General"}
                                </span>
                              </td>
                              <td className="fw-bold text-success">Rs. {c.price || 0}</td>
                              <td>
                                <button className="btn btn-outline-danger btn-sm rounded-3 fw-semibold"
                                  onClick={() => deleteCourse(c._id, c.title)}>
                                  🗑️ Delete
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

          </>
        )}
      </div>
    </div>
  );
}

export default AdminPanel;