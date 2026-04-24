import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import ConfirmModal from "../components/ConfirmModal";
import { toast } from "react-toastify";

function Dashboard() {
  const [courses, setCourses] = useState([]);
  const [role, setRole] = useState("");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [actionType, setActionType] = useState(""); // "delete" or "unenroll"

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Please login");
      setLoading(false);
      return;
    }

    try {
      const decoded = JSON.parse(atob(token.split(".")[1]));
      setRole(decoded.role);
      setUser(decoded);

      const url =
        decoded.role === "student"
          ? "http://localhost:5000/api/enroll/my-courses"
          : "http://localhost:5000/api/courses/my-courses";

      axios
        .get(url, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          setCourses(res.data || []); // ✅ safe fallback
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setCourses([]); // ✅ avoid undefined crash
          setLoading(false);
        });
    } catch (err) {
      console.log("Invalid token");
      setLoading(false);
    }
  }, []);

  // 🔥 Update progress WITHOUT reload
  const updateProgress = async (id, value) => {
    const token = localStorage.getItem("token");

    try {
      await axios.put(
        `http://localhost:5000/api/enroll/progress/${id}`,
        { progress: value },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setCourses((prev) =>
        prev.map((c) =>
          c._id === id ? { ...c, progress: value || 0 } : c
        )
      );
    } catch (err) {
      toast.error("Error updating progress");
    }
  };

  const handleActionClick = (id, type) => {
    setSelectedId(id);
    setActionType(type);
    setShowModal(true);
  };

  const confirmAction = async () => {
    const token = localStorage.getItem("token");

    try {
      if (actionType === "delete") {
        await axios.delete(`http://localhost:5000/api/courses/${selectedId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setCourses((prev) => prev.filter((c) => c._id !== selectedId));
      }

      if (actionType === "unenroll") {
        await axios.delete(
          `http://localhost:5000/api/enroll/${selectedId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setCourses((prev) =>
          prev.filter((c) => c.course?._id !== selectedId)
        );
      }
      setShowModal(false);
      setSelectedId(null);


      setShowModal(false);
      setSelectedId(null);
      setActionType("");
    } catch (err) {
  console.log(err.response?.data || err.message);
  toast.error(err.response?.data?.message || "Action failed");
}
  };

  const editCourse = async (id) => {
    const title = prompt("Enter new title");
    const description = prompt("Enter new description");

    if (!title || !description) return; // ✅ avoid empty update

    const token = localStorage.getItem("token");

    try {
      await axios.put(
        `http://localhost:5000/api/courses/${id}`,
        { title, description },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setCourses((prev) =>
        prev.map((c) =>
          c._id === id ? { ...c, title, description } : c
        )
      );
    } catch (err) {
      toast.error("Error updating course");
    }
  };

  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const avgProgress =
    role === "student" && courses.length > 0
      ? Math.round(
          courses.reduce((acc, item) => acc + (item.progress || 0), 0) /
            courses.length
        )
      : 0;

  const greetingTime = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 18) return "Good afternoon";
    return "Good evening";
  };

  const getProgressColor = (val) => {
    const safeVal = val || 0; // ✅ FIX (Problem 2)
    if (safeVal >= 100) return "bg-success";
    if (safeVal >= 50) return "bg-primary";
    return "bg-warning";
  };

return (
  <div className="bg-light min-vh-100">
    <div className="container py-5">

      {/* 🔥 LOADING */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" />
        </div>
      ) : (
        <>
          {/* HERO */}
          <motion.div
            className="mb-4"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="fw-bold">
              {greetingTime()}
              {user?.name ? `, ${user.name.split(" ")[0]}` : ""} 👋
            </h1>
            <p className="text-muted">
              Here's what's happening with your courses today.
            </p>
          </motion.div>

          {/* USER CARD */}
          {user && (
            <div className="card shadow-sm rounded-4 mb-4">
              <div className="card-body d-flex gap-3">
                <div
                  className="bg-primary text-white rounded-3 d-flex align-items-center justify-content-center"
                  style={{ width: 50, height: 50 }}
                >
                  {getInitials(user.name)}
                </div>
                <div>
                  <h5 className="fw-bold mb-1">{user.name}</h5>
                  <small className="text-muted">{user.email}</small>
                </div>
              </div>
            </div>
          )}

          {/* STATS */}
          <div className="row mb-4">
            <div className="col-md-3">
              <div className="card p-3 shadow-sm rounded-4">
                <p className="small text-muted">Total Courses</p>
                <h3>{courses.length}</h3>
              </div>
            </div>

            {role === "student" && (
              <div className="col-md-3">
                <div className="card p-3 shadow-sm rounded-4">
                  <p className="small text-muted">Avg Progress</p>
                  <h3>{avgProgress}%</h3>
                </div>
              </div>
            )}
          </div>

          {/* ❗ EMPTY STATE (FIXED POSITION) */}
          {courses.length === 0 ? (
            <div className="text-center py-5">
              <h5 className="text-muted">No courses found</h5>
            </div>
          ) : (
            <div className="row">
              {courses.map((item) => {
                const courseData =
                  role === "student" ? item.course : item;

                return (
                  <div className="col-md-4 mb-4" key={item._id}>
                    <div className="card shadow-sm h-100 p-3 d-flex flex-column">

                      <h5>{courseData?.title || "No Title"}</h5>
                      <p className="text-muted">
                        {courseData?.description || "No description"}
                      </p>

                      {/* INSTRUCTOR */}
                      {role === "instructor" && (
                        <div className="mt-auto d-flex gap-2">
                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => editCourse(item._id)}
                          >
                            Edit
                          </button>

                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() =>
                              handleActionClick(item._id, "delete")
                            }
                          >
                            Delete
                          </button>
                        </div>
                      )}

                      {/* STUDENT */}
                      {role === "student" && (
                        <>
                          {/* Progress */}
                          <div className="progress mb-2">
                            <div
                              className={`progress-bar ${getProgressColor(
                                item?.progress || 0
                              )}`}
                              style={{
                                width: `${item?.progress || 0}%`,
                              }}
                            />
                          </div>

                          {/* Progress buttons */}
                          <div className="d-flex gap-2 mb-2">
                            <button
                              onClick={() =>
                                updateProgress(item._id, 25)
                              }
                              className="btn btn-sm btn-outline-warning"
                            >
                              25%
                            </button>
                            <button
                              onClick={() =>
                                updateProgress(item._id, 50)
                              }
                              className="btn btn-sm btn-outline-primary"
                            >
                              50%
                            </button>
                            <button
                              onClick={() =>
                                updateProgress(item._id, 100)
                              }
                              className="btn btn-sm btn-outline-success"
                            >
                              Done
                            </button>
                          </div>

                          {/* Remove */}
                          <button
                            className="btn btn-sm btn-outline-danger w-100"
                            onClick={() => handleActionClick(item.course._id, "unenroll")}
                          >
                            ❌ Remove Course
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>

    {/* ✅ MODAL (correct placement) */}
    <ConfirmModal
      show={showModal}
      onClose={() => setShowModal(false)}
      onConfirm={confirmAction}
      title={
        actionType === "delete"
          ? "Delete Course?"
          : "Remove Course?"
      }
      message={
        actionType === "delete"
          ? "This will permanently delete the course."
          : "This will remove the course from your dashboard."
      }
    />
  </div>
);
}

export default Dashboard;