import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

const API = "http://localhost:5000/api";

function Courses() {
  const [courses, setCourses] = useState([]);
  const [enrolledIds, setEnrolledIds] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [enrollingId, setEnrollingId] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      const res = await axios.get(`${API}/courses`);
      setCourses(res.data);

      const token = localStorage.getItem("token");

      if (token) {
        const enrollRes = await axios.get(`${API}/enroll/my-courses`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const ids = enrollRes.data.map((item) => item.course._id);
        setEnrolledIds(ids);
      }

    } catch (err) {
      console.log(err);
      toast.error("Error loading courses");
    } finally {
      setLoading(false);
    }
  };

  const enrollCourse = async (courseId) => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Please login first");
      return;
    }

    try {
      setEnrollingId(courseId);

      await axios.post(
        `${API}/enroll`,
        { courseId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setEnrolledIds((prev) => [...prev, courseId]);

    } catch (err) {
      toast.error(err.response?.data?.message || "Error enrolling");
    } finally {
      setEnrollingId(null);
    }
  };

  const filteredCourses = courses.filter((course) =>
    course.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-light min-vh-100">

      {/* HERO */}
      <div className="bg-primary text-white py-5">
        <motion.div
          className="container py-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="row align-items-center">

            <div className="col-lg-7">
              <h1 className="display-5 fw-bold mb-3">
                Learn New Skills <span className="text-warning">Online</span>
              </h1>

              <div className="input-group input-group-lg" style={{ maxWidth: 520 }}>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search courses..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                {search && (
                  <button className="btn btn-light" onClick={() => setSearch("")}>
                    ✕
                  </button>
                )}
              </div>
            </div>

            {/* STATS (kept from your design) */}
            <div className="col-lg-5 d-none d-lg-flex justify-content-end">
              <div className="row g-3 text-center">
                <div className="col-6">
                  <div className="card border-0 rounded-4 p-3 bg-white bg-opacity-10 text-white">
                    <h3 className="fw-bold mb-0">{courses.length}+</h3>
                    <small>Courses</small>
                  </div>
                </div>
                <div className="col-6">
                  <div className="card border-0 rounded-4 p-3 bg-white bg-opacity-10 text-white">
                    <h3 className="fw-bold mb-0">{enrolledIds.length}</h3>
                    <small>Enrolled</small>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </motion.div>
      </div>

      <div className="container py-5">

        {/* LOADING */}
        {loading && (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" />
            <p className="mt-3 text-muted">Loading courses...</p>
          </div>
        )}

        {/* EMPTY */}
        {!loading && filteredCourses.length === 0 && (
          <div className="text-center py-5">
            <h5>No courses found</h5>
          </div>
        )}

        {/* GRID */}
        <div className="row g-4">
          {filteredCourses.map((course, idx) => (
            <motion.div
              className="col-md-6 col-lg-4"
              key={course._id}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
              whileHover={{ y: -4 }}
            >
              <div className="card border-0 shadow-sm rounded-4 h-100 overflow-hidden">

                {/* IMAGE */}
                <div style={{ height: 190 }}>
                  <img
                    src={course.image}
                    alt={course.title}
                    className="w-100 h-100"
                    style={{ objectFit: "cover" }}
                    onError={(e) =>
                      (e.target.src =
                        "https://via.placeholder.com/300x200?text=Course")
                    }
                  />
                </div>

                <div className="card-body d-flex flex-column p-4">

                  <h5 className="fw-bold">{course.title}</h5>

                  <p className="text-muted small flex-grow-1">
                    {course.description}
                  </p>

                  <div className="d-flex justify-content-between align-items-center">

                    <span className="fw-bold text-success">
                      Rs. {course.price || 0}
                    </span>

                    {enrolledIds.includes(course._id) ? (
                      <button className="btn btn-success" disabled>
                        Enrolled
                      </button>
                    ) : (
                      <button
                        className="btn btn-primary"
                        disabled={enrollingId === course._id}
                        onClick={() => enrollCourse(course._id)}
                      >
                        {enrollingId === course._id
                          ? "Enrolling..."
                          : "Enroll"}
                      </button>
                    )}
                  </div>

                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </div>
  );
}

export default Courses;