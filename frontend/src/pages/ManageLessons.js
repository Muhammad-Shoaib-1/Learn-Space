import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

const BASE = "http://localhost:5000/api";

function ManageLessons() {
  const { courseId } = useParams();

  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    title: "", content: "", videoUrl: "", duration: "",
  });

  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [courseRes, lessonsRes] = await Promise.all([
        axios.get(`${BASE}/courses/${courseId}`),
        axios.get(`${BASE}/lessons/${courseId}`, { headers }),
      ]);
      setCourse(courseRes.data);
      setLessons(lessonsRes.data);
    } catch (err) {
      toast.error("Error loading course data");
    }
    setLoading(false);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setForm({ title: "", content: "", videoUrl: "", duration: "" });
    setEditingId(null);
  };

  const handleSubmit = async () => {
    if (!form.title.trim()) {
      toast.warning("Lesson title is required");
      return;
    }
    setSaving(true);
    try {
      if (editingId) {
        const { data } = await axios.put(
          `${BASE}/lessons/${editingId}`,
          form,
          { headers }
        );
        setLessons(lessons.map((l) => (l._id === editingId ? data : l)));
        toast.success("Lesson updated ✅");
      } else {
        const { data } = await axios.post(
          `${BASE}/lessons/${courseId}`,
          form,
          { headers }
        );
        setLessons([...lessons, data]);
        toast.success("Lesson added ✅");
      }
      resetForm();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error saving lesson");
    }
    setSaving(false);
  };

  const handleEdit = (lesson) => {
    setEditingId(lesson._id);
    setForm({
      title:    lesson.title    || "",
      content:  lesson.content  || "",
      videoUrl: lesson.videoUrl || "",
      duration: lesson.duration || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (lessonId, title) => {
    if (!window.confirm(`Delete lesson "${title}"?`)) return;
    try {
      await axios.delete(`${BASE}/lessons/${lessonId}`, { headers });
      setLessons(lessons.filter((l) => l._id !== lessonId));
      toast.success("Lesson deleted");
      if (editingId === lessonId) resetForm();
    } catch (err) {
      toast.error("Error deleting lesson");
    }
  };

  const getYoutubeEmbed = (url) => {
    if (!url) return null;
    const match = url.match(
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/
    );
    return match ? `https://www.youtube.com/embed/${match[1]}` : null;
  };

  if (loading) {
    return (
      <div className="min-vh-100 bg-light d-flex align-items-center justify-content-center">
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" style={{ width: 48, height: 48 }} />
          <p className="text-muted fw-semibold">Loading lessons...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-light min-vh-100">
      <div className="container py-5">

        {/* ── HEADER ── */}
        <motion.div
          className="mb-4"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <nav className="mb-2">
            <ol className="breadcrumb small">
              <li className="breadcrumb-item">
                <Link to="/dashboard" className="text-decoration-none">Dashboard</Link>
              </li>
              <li className="breadcrumb-item">
                <Link to={`/courses/${courseId}`} className="text-decoration-none">Course</Link>
              </li>
              <li className="breadcrumb-item active">Manage Lessons</li>
            </ol>
          </nav>

          <span className="badge bg-warning bg-opacity-25 text-warning rounded-pill px-3 py-2 fw-semibold small mb-2 d-inline-block">
            🧑‍🏫 Instructor
          </span>
          <h2 className="fw-bold display-6 text-dark mb-0">Manage Lessons</h2>
          {course && (
            <p className="text-muted mb-0 mt-1">
              Course: <strong className="text-dark">{course.title}</strong>
              <span className="ms-2 badge bg-primary bg-opacity-10 text-primary rounded-pill small">
                {lessons.length} lessons
              </span>
            </p>
          )}
        </motion.div>

        <div className="row g-4">

          {/* ── LEFT: FORM ── */}
          <div className="col-lg-5">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
                <div className={editingId ? "bg-warning" : "bg-primary"} style={{ height: 5 }} />
                <div className="card-body p-4">

                  <h6 className="fw-bold text-dark mb-4">
                    {editingId ? "✏️ Edit Lesson" : "➕ Add New Lesson"}
                  </h6>

                  {/* Title */}
                  <div className="mb-3">
                    <label className="form-label fw-semibold text-dark small text-uppercase">
                      Lesson Title <span className="text-danger">*</span>
                    </label>
                    <input
                      className="form-control rounded-3"
                      name="title"
                      placeholder="e.g. Introduction to React"
                      value={form.title}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Duration */}
                  <div className="mb-3">
                    <label className="form-label fw-semibold text-dark small text-uppercase">
                      Duration
                    </label>
                    <div className="input-group">
                      <span className="input-group-text bg-light rounded-start-3">⏱️</span>
                      <input
                        className="form-control rounded-end-3"
                        name="duration"
                        placeholder="e.g. 12:30"
                        value={form.duration}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="form-text text-muted">Format: mm:ss</div>
                  </div>

                  {/* Video URL */}
                  <div className="mb-3">
                    <label className="form-label fw-semibold text-dark small text-uppercase">
                      Video URL
                    </label>
                    <div className="input-group">
                      <span className="input-group-text bg-light rounded-start-3">🎬</span>
                      <input
                        className="form-control rounded-end-3"
                        name="videoUrl"
                        placeholder="YouTube or video link"
                        value={form.videoUrl}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="form-text text-muted">Paste a YouTube link to embed the video.</div>
                  </div>

                  {/* YouTube Preview */}
                  {getYoutubeEmbed(form.videoUrl) && (
                    <div className="mb-3 rounded-3 overflow-hidden" style={{ height: 180 }}>
                      <iframe
                        src={getYoutubeEmbed(form.videoUrl)}
                        title="Preview"
                        className="w-100 h-100"
                        frameBorder="0"
                        allowFullScreen
                      />
                    </div>
                  )}

                  {/* Content */}
                  <div className="mb-4">
                    <label className="form-label fw-semibold text-dark small text-uppercase">
                      Lesson Notes / Content
                    </label>
                    <textarea
                      className="form-control rounded-3"
                      name="content"
                      rows={4}
                      placeholder="Write lesson notes, key points, or additional content..."
                      value={form.content}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Buttons */}
                  <div className="d-flex gap-2">
                    <button
                      className={`btn flex-fill rounded-3 fw-semibold ${editingId ? "btn-warning text-dark" : "btn-primary"}`}
                      onClick={handleSubmit}
                      disabled={saving}
                    >
                      {saving ? (
                        <><span className="spinner-border spinner-border-sm me-2" />{editingId ? "Updating..." : "Adding..."}</>
                      ) : (
                        editingId ? "✏️ Update Lesson" : "➕ Add Lesson"
                      )}
                    </button>

                    {editingId && (
                      <button
                        className="btn btn-outline-secondary rounded-3 fw-semibold"
                        onClick={resetForm}
                      >
                        Cancel
                      </button>
                    )}
                  </div>

                </div>
              </div>
            </motion.div>
          </div>

          {/* ── RIGHT: LESSONS LIST ── */}
          <div className="col-lg-7">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              {lessons.length === 0 ? (
                <div className="card border-0 shadow-sm rounded-4 text-center py-5">
                  <div className="card-body">
                    <span className="fs-1">📭</span>
                    <h6 className="fw-bold text-dark mt-3">No lessons yet</h6>
                    <p className="text-muted small">Add your first lesson using the form on the left.</p>
                  </div>
                </div>
              ) : (
                <div className="d-flex flex-column gap-3">
                  {lessons.map((lesson, i) => (
                    <motion.div
                      key={lesson._id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: i * 0.06 }}
                    >
                      <div className={`card border-0 shadow-sm rounded-4 ${editingId === lesson._id ? "border border-warning" : ""}`}>
                        <div className="card-body p-4">

                          <div className="d-flex align-items-start justify-content-between gap-2 mb-2">
                            <div className="d-flex align-items-center gap-3">
                              <div
                                className="rounded-3 bg-primary text-white d-flex align-items-center justify-content-center fw-bold flex-shrink-0"
                                style={{ width: 36, height: 36, fontSize: 14 }}
                              >
                                {lesson.order || i + 1}
                              </div>
                              <div>
                                <h6 className="fw-bold text-dark mb-0">{lesson.title}</h6>
                                {lesson.duration && (
                                  <span className="text-muted small">⏱️ {lesson.duration}</span>
                                )}
                              </div>
                            </div>

                            <div className="d-flex gap-2 flex-shrink-0">
                              <button
                                className="btn btn-outline-primary btn-sm rounded-3 fw-semibold"
                                onClick={() => handleEdit(lesson)}
                              >
                                ✏️ Edit
                              </button>
                              <button
                                className="btn btn-outline-danger btn-sm rounded-3 fw-semibold"
                                onClick={() => handleDelete(lesson._id, lesson.title)}
                              >
                                🗑️
                              </button>
                            </div>
                          </div>

                          {/* YouTube embed */}
                          {lesson.videoUrl && getYoutubeEmbed(lesson.videoUrl) && (
                            <div className="rounded-3 overflow-hidden mb-3" style={{ height: 180 }}>
                              <iframe
                                src={getYoutubeEmbed(lesson.videoUrl)}
                                title={lesson.title}
                                className="w-100 h-100"
                                frameBorder="0"
                                allowFullScreen
                              />
                            </div>
                          )}

                          {/* Non-youtube video link */}
                          {lesson.videoUrl && !getYoutubeEmbed(lesson.videoUrl) && (
                            <a
                              href={lesson.videoUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="btn btn-outline-secondary btn-sm rounded-3 fw-semibold mb-3"
                            >
                              🎬 Watch Video
                            </a>
                          )}

                          {/* Content notes */}
                          {lesson.content && (
                            <p className="text-muted small mb-0" style={{ lineHeight: 1.7 }}>
                              {lesson.content.length > 150
                                ? lesson.content.slice(0, 150) + "…"
                                : lesson.content}
                            </p>
                          )}

                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default ManageLessons;