import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

function Dashboard() {
  const [courses, setCourses] = useState([]);
  const [role, setRole] = useState("");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login");
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
          setCourses(res.data);
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    } catch (err) {
      console.log("Invalid token");
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

      // Update UI instantly
      setCourses((prev) =>
        prev.map((c) =>
          c._id === id ? { ...c, progress: value } : c
        )
      );
    } catch (err) {
      alert("Error updating progress");
    }
  };

  const deleteCourse = async (id) => {
    const token = localStorage.getItem("token");

    if (!window.confirm("Delete this course?")) return;

    try {
      await axios.delete(`http://localhost:5000/api/courses/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setCourses(courses.filter((c) => c._id !== id));
    } catch (err) {
      alert("Error deleting course");
    }
  };

  const editCourse = async (id) => {
    const title = prompt("Enter new title");
    const description = prompt("Enter new description");

    const token = localStorage.getItem("token");

    try {
      await axios.put(
        `http://localhost:5000/api/courses/${id}`,
        { title, description },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Update UI without reload
      setCourses((prev) =>
        prev.map((c) =>
          c._id === id ? { ...c, title, description } : c
        )
      );
    } catch (err) {
      alert("Error updating course");
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
          courses.reduce((acc, item) => acc + item.progress, 0) /
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
    if (val >= 100) return "bg-success";
    if (val >= 50) return "bg-primary";
    return "bg-warning";
  };

  return (
    <div className="bg-light min-vh-100">
      <div className="container py-5">

        {/* 🔥 LOADING */}
        {loading && (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" />
          </div>
        )}

        {!loading && (
          <>
            {/* HERO */}
            <motion.div
              className="mb-4"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h1 className="fw-bold">
                {greetingTime()}
                {user?.name && `, ${user.name.split(" ")[0]}`} 👋
              </h1>
              <p className="text-muted">
                Here's what's happening with your courses today.
              </p>
            </motion.div>

            {/* USER CARD */}
            {user && (
              <div className="card shadow-sm rounded-4 mb-4">
                <div className="card-body d-flex gap-3">
                  <div className="bg-primary text-white rounded-3 d-flex align-items-center justify-content-center"
                    style={{ width: 50, height: 50 }}>
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

            {/* COURSES */}
            <div className="row">
              {courses.map((item) => {
                const courseData =
                  role === "student" ? item.course : item;

                return (
                  <div className="col-md-4 mb-4" key={item._id}>
                    <div className="card shadow-sm h-100 p-3">

                      <h5>{courseData.title}</h5>
                      <p className="text-muted">
                        {courseData.description}
                      </p>

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
                            onClick={() => deleteCourse(item._id)}
                          >
                            Delete
                          </button>
                        </div>
                      )}

                      {role === "student" && (
                        <>
                          <div className="progress mb-2">
                            <div
                              className={`progress-bar ${getProgressColor(item.progress)}`}
                              style={{ width: `${item.progress}%` }}
                            />
                          </div>

                          <div className="d-flex gap-2">
                            <button onClick={() => updateProgress(item._id, 25)} className="btn btn-sm btn-outline-warning">25%</button>
                            <button onClick={() => updateProgress(item._id, 50)} className="btn btn-sm btn-outline-primary">50%</button>
                            <button onClick={() => updateProgress(item._id, 100)} className="btn btn-sm btn-outline-success">Done</button>
                          </div>
                        </>
                      )}

                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Dashboard;