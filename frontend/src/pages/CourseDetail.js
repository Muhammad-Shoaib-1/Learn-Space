import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

function CourseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolled, setEnrolled] = useState(false);
  const [enrolling, setEnrolling] = useState(false);
  const [relatedCourses, setRelatedCourses] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [showPayment, setShowPayment] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [cardDetails, setCardDetails] = useState({
    cardName: "", cardNumber: "", expiry: "", cvv: "",
  });

  const token = localStorage.getItem("token");
  const user = (() => {
    try { return JSON.parse(atob(token.split(".")[1])); }
    catch { return null; }
  })();

  useEffect(() => {
    fetchCourse();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchCourse = async () => {
    setLoading(true);
    try {
      // Fetch course detail
      const { data } = await axios.get(`http://localhost:5000/api/courses/${id}`);
      setCourse(data);

      // Fetch all courses to get related ones (same category)
      const allRes = await axios.get("http://localhost:5000/api/courses");
      const related = allRes.data
        .filter((c) => c._id !== id && c.category === data.category)
        .slice(0, 3);
      setRelatedCourses(related);

      // Check if already enrolled
      if (token) {
        const enrollRes = await axios.get(
          "http://localhost:5000/api/enroll/my-courses",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const ids = enrollRes.data.map((e) => e.course._id);
        setEnrolled(ids.includes(id));
        // Fetch lessons if enrolled
          if (ids.includes(id)) {
            const lessonsRes = await axios.get(
            `http://localhost:5000/api/lessons/${id}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setLessons(lessonsRes.data);
        }
      }
    } catch (err) {
      toast.error("Course not found");
      navigate("/courses");
    }
    setLoading(false);
  };

  const handleEnroll = async () => {
    if (!token) {
      toast.warning("Please login to enroll");
      navigate("/login");
      return;
    }
    setEnrolling(true);
    try {
      await axios.post(
        "http://localhost:5000/api/enroll",
        { courseId: id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEnrolled(true);
      toast.success("Enrolled successfully! 🎉");
    } catch (err) {
      toast.error(err.response?.data?.message || "Error enrolling");
    }
    setEnrolling(false);
  };

  const handlePaymentEnroll = async () => {
  // Basic validation
  if (!cardDetails.cardName || !cardDetails.cardNumber ||
      !cardDetails.expiry || !cardDetails.cvv) {
    toast.warning("Please fill all payment fields");
    return;
  }
  if (cardDetails.cardNumber.replace(/\s/g, "").length < 16) {
    toast.warning("Enter a valid 16-digit card number");
    return;
  }

  setProcessing(true);

  // Simulate payment processing (2 seconds)
  await new Promise((resolve) => setTimeout(resolve, 2000));

    try {
      await axios.post(
        "http://localhost:5000/api/enroll",
        { courseId: id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEnrolled(true);
      setShowPayment(false);
      toast.success("Payment successful! Enrolled 🎉");
    } catch (err) {
      toast.error(err.response?.data?.message || "Error enrolling");
    }
    setProcessing(false);
  };

  if (loading) {
    return (
      <div className="min-vh-100 bg-light d-flex align-items-center justify-content-center">
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" style={{ width: 48, height: 48 }} />
          <p className="text-muted fw-semibold">Loading course...</p>
        </div>
      </div>
    );
  }

  if (!course) return null;

  const whatYouLearn = [
    "Understand core concepts from scratch",
    "Build real-world projects step by step",
    "Industry best practices and standards",
    "Hands-on exercises and assignments",
    "Certificate of completion",
    "Lifetime access to course material",
  ];

 return (
    <div className="bg-light min-vh-100">

      {/* ── HERO BANNER ── */}
      <div className="bg-dark text-white py-5">
        <div className="container py-3">
          <div className="row align-items-center g-4">
            <motion.div
              className="col-lg-7"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Breadcrumb */}
              <nav className="mb-3">
                <ol className="breadcrumb mb-0" style={{ fontSize: 13 }}>
                  <li className="breadcrumb-item">
                    <Link to="/" className="text-white opacity-50 text-decoration-none">Home</Link>
                  </li>
                  <li className="breadcrumb-item">
                    <Link to="/courses" className="text-white opacity-50 text-decoration-none">Courses</Link>
                  </li>
                  <li className="breadcrumb-item active text-white opacity-75">{course.title}</li>
                </ol>
              </nav>

              {/* Category badge */}
              <span className="badge bg-primary rounded-pill px-3 py-2 fw-semibold small mb-3">
                {course.category || "General"}
              </span>

              <h1 className="fw-bold display-6 mb-3 lh-sm">{course.title}</h1>
              <p className="opacity-75 mb-4" style={{ fontSize: 16 }}>{course.description}</p>

              {/* Meta row */}
              <div className="d-flex flex-wrap gap-4 mb-4">
                <div className="d-flex align-items-center gap-2">
                  <div
                    className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold flex-shrink-0"
                    style={{ width: 36, height: 36, fontSize: 13 }}
                  >
                    {course.instructor?.name?.charAt(0).toUpperCase() || "I"}
                  </div>
                  <div>
                    <div style={{ fontSize: 12 }} className="opacity-50">Instructor</div>
                    <div className="fw-semibold small">{course.instructor?.name || "Unknown"}</div>
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 12 }} className="opacity-50">Category</div>
                  <div className="fw-semibold small">{course.category || "General"}</div>
                </div>
                <div>
                  <div style={{ fontSize: 12 }} className="opacity-50">Rating</div>
                  <div className="fw-semibold small text-warning">★★★★★ 4.9</div>
                </div>
              </div>
            </motion.div>

            {/* ── ENROLLMENT CARD ── */}
            <motion.div
              className="col-lg-5"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="card border-0 shadow-lg rounded-4 overflow-hidden">
                {/* Course image */}
                <div style={{ height: 200, overflow: "hidden" }}>
                  <img
                    src={
                      course.image?.startsWith("/uploads")
                        ? `http://localhost:5000${course.image}`
                        : course.image || "https://via.placeholder.com/400x200"
                    }
                    alt={course.title}
                    className="w-100 h-100"
                    style={{ objectFit: "cover" }}
                    onError={(e) => {
                      e.currentTarget.src = "https://via.placeholder.com/400x200?text=Course";
                    }}
                  />
                </div>

                <div className="card-body p-4">
                  {/* Price */}
                  <div className="d-flex align-items-center gap-2 mb-4">
                    <h2 className="fw-bold text-success mb-0">
                      {course.price === 0 ? "Free" : `Rs. ${course.price}`}
                    </h2>
                    {course.price > 0 && (
                      <span className="badge bg-success bg-opacity-10 text-success rounded-pill fw-semibold">
                        Best Value
                      </span>
                    )}
                  </div>

                  {/* ── ENROLL BUTTON ── */}
                  {user?.role === "instructor" || user?.role === "admin" ? (
                    <div className="alert alert-info rounded-3 small text-center mb-3 py-2">
                      Only students can enroll in courses.
                    </div>
                  ) : enrolled ? (
                    <>
                      <button className="btn btn-success w-100 rounded-3 fw-bold btn-lg mb-2" disabled>
                        ✅ Already Enrolled
                      </button>
                      <Link
                        to="/dashboard"
                        className="btn btn-outline-primary w-100 rounded-3 fw-semibold"
                      >
                        Go to Dashboard →
                      </Link>
                    </>
                  ) : (
                    <button
                      className="btn btn-primary w-100 rounded-3 fw-bold btn-lg mb-2"
                      onClick={() => course.price === 0 ? handleEnroll() : setShowPayment(true)}
                      disabled={enrolling}
                    >
                      {enrolling ? (
                        <><span className="spinner-border spinner-border-sm me-2" />Enrolling...</>
                      ) : course.price === 0 ? (
                        "Enroll Now 🚀"
                      ) : (
                        `Pay Rs. ${course.price} & Enroll 💳`
                      )}
                    </button>
                  )}

                  <hr className="my-3" />

                  {/* Course includes */}
                  <p className="fw-semibold text-dark small text-uppercase mb-2">This course includes:</p>
                  <ul className="list-unstyled mb-0">
                    {[
                      { icon: "📱", text: "Full lifetime access" },
                      { icon: "🎓", text: "Certificate of completion" },
                      { icon: "♾️",  text: "Access on all devices" },
                      { icon: "📊", text: "Progress tracking" },
                    ].map((item, i) => (
                      <li key={i} className="d-flex align-items-center gap-2 mb-2 text-muted small">
                        <span>{item.icon}</span> {item.text}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* ── TABS ── only show if enrolled student ── */}
      {enrolled && user?.role === "student" && (
        <div className="bg-white border-bottom">
          <div className="container">
            <div className="d-flex gap-2 pt-3">
              {["overview", "lessons"].map((tab) => (
                <button
                  key={tab}
                  className={`btn btn-sm fw-semibold px-4 pb-3 rounded-0 border-0 border-bottom border-3 ${
                    activeTab === tab
                      ? "text-primary border-primary"
                      : "text-muted border-transparent"
                  }`}
                  onClick={() => setActiveTab(tab)}
                  style={{ borderBottomWidth: "3px !important" }}
                >
                  {tab === "overview" ? "📋 Overview" : `📚 Lessons (${lessons.length})`}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── MAIN CONTENT ── */}
      <div className="container py-5">

        {/* ── LESSONS TAB ── */}
        {activeTab === "lessons" && enrolled && (
          <div className="col-12 mb-5">
            {lessons.length === 0 ? (
              <div className="card border-0 shadow-sm rounded-4 text-center py-5">
                <div className="card-body">
                  <span className="fs-1">📭</span>
                  <h6 className="fw-bold text-dark mt-3">No lessons yet</h6>
                  <p className="text-muted small">The instructor hasn't added any lessons yet. Check back soon!</p>
                </div>
              </div>
            ) : (
              <div className="d-flex flex-column gap-3">
                {lessons.map((lesson, i) => (
                  <motion.div
                    key={lesson._id}
                    className="card border-0 shadow-sm rounded-4"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.06 }}
                  >
                    <div className="card-body p-4">
                      <div className="d-flex align-items-center gap-3 mb-3">
                        <div
                          className="rounded-3 bg-primary text-white d-flex align-items-center justify-content-center fw-bold flex-shrink-0"
                          style={{ width: 40, height: 40, fontSize: 14 }}
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

                      {/* YouTube embed */}
                      {lesson.videoUrl && (() => {
                        const match = lesson.videoUrl.match(
                          /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/
                        );
                        const embedUrl = match ? `https://www.youtube.com/embed/${match[1]}` : null;
                        return embedUrl ? (
                          <div className="rounded-3 overflow-hidden mb-3" style={{ height: 280 }}>
                            <iframe
                              src={embedUrl}
                              title={lesson.title}
                              className="w-100 h-100"
                              frameBorder="0"
                              allowFullScreen
                            />
                          </div>
                        ) : (
                          <a href={lesson.videoUrl} target="_blank" rel="noreferrer"
                            className="btn btn-outline-primary btn-sm rounded-3 fw-semibold mb-3">
                            🎬 Watch Video
                          </a>
                        );
                      })()}

                      {/* Notes */}
                      {lesson.content && (
                        <div className="bg-light rounded-3 p-3">
                          <p className="text-muted small mb-0" style={{ lineHeight: 1.8 }}>
                            {lesson.content}
                          </p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="row g-4">
          <div className="col-lg-8">

            {/* What you'll learn */}
            <motion.div
              className="card border-0 shadow-sm rounded-4 mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <div className="card-body p-4">
                <h5 className="fw-bold text-dark mb-3">📋 What You'll Learn</h5>
                <div className="row g-2">
                  {whatYouLearn.map((item, i) => (
                    <div className="col-md-6" key={i}>
                      <div className="d-flex align-items-start gap-2">
                        <span className="text-success fw-bold mt-1" style={{ fontSize: 14 }}>✓</span>
                        <span className="text-muted small">{item}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Course Description */}
            <motion.div
              className="card border-0 shadow-sm rounded-4 mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <div className="card-body p-4">
                <h5 className="fw-bold text-dark mb-3">📖 Course Description</h5>
                <p className="text-muted" style={{ lineHeight: 1.8 }}>{course.description}</p>
                <p className="text-muted" style={{ lineHeight: 1.8 }}>
                  This course is designed to take you from beginner to professional level.
                  You will work on hands-on projects that mirror real-world scenarios,
                  giving you the confidence to apply your skills immediately after completion.
                </p>
              </div>
            </motion.div>

            {/* Instructor card */}
            <motion.div
              className="card border-0 shadow-sm rounded-4 mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <div className="card-body p-4">
                <h5 className="fw-bold text-dark mb-3">🧑‍🏫 About the Instructor</h5>
                <div className="d-flex align-items-center gap-3 mb-3">
                  <div
                    className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold flex-shrink-0"
                    style={{ width: 56, height: 56, fontSize: 20 }}
                  >
                    {course.instructor?.name?.charAt(0).toUpperCase() || "I"}
                  </div>
                  <div>
                    <h6 className="fw-bold text-dark mb-0">{course.instructor?.name || "Unknown"}</h6>
                    <p className="text-muted small mb-0">{course.instructor?.email || ""}</p>
                    <span className="badge bg-warning bg-opacity-25 text-warning rounded-pill small fw-semibold mt-1">
                      🧑‍🏫 Instructor
                    </span>
                  </div>
                </div>
                <p className="text-muted small mb-0" style={{ lineHeight: 1.8 }}>
                  An experienced instructor with expertise in {course.category || "this field"}.
                  Passionate about teaching and helping students achieve their goals through
                  practical, project-based learning.
                </p>
              </div>
            </motion.div>

          </div>

          {/* ── SIDEBAR ── */}
          <div className="col-lg-4">

            {/* Course Info */}
            <motion.div
              className="card border-0 shadow-sm rounded-4 mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.15 }}
            >
              <div className="card-body p-4">
                <h6 className="fw-bold text-dark mb-3">📊 Course Info</h6>
                <ul className="list-unstyled mb-0">
                  {[
                    { label: "Category",   value: course.category || "General" },
                    { label: "Price",      value: course.price === 0 ? "Free" : `Rs. ${course.price}` },
                    { label: "Instructor", value: course.instructor?.name || "—" },
                    { label: "Language",   value: "Urdu / English" },
                    { label: "Level",      value: "Beginner to Advanced" },
                    { label: "Access",     value: "Lifetime" },
                  ].map((info, i) => (
                    <li key={i} className="d-flex justify-content-between align-items-center py-2 border-bottom">
                      <span className="text-muted small">{info.label}</span>
                      <span className="fw-semibold small text-dark">{info.value}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>

            {/* Share */}
            <motion.div
              className="card border-0 shadow-sm rounded-4 mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.25 }}
            >
              <div className="card-body p-4">
                <h6 className="fw-bold text-dark mb-3">🔗 Share This Course</h6>
                <button
                  className="btn btn-outline-primary w-100 rounded-3 fw-semibold small mb-2"
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    toast.success("Link copied to clipboard!");
                  }}
                >
                  📋 Copy Link
                </button>
              </div>
            </motion.div>

          </div>
        </div>

        {/* ── RELATED COURSES ── */}
        {relatedCourses.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
          >
            <h5 className="fw-bold text-dark mb-4">🔍 Related Courses</h5>
            <div className="row g-4">
              {relatedCourses.map((c) => (
                <div className="col-md-4" key={c._id}>
                  <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
                    <div className="card border-0 shadow-sm rounded-4 h-100 overflow-hidden">
                      <div style={{ height: 160, overflow: "hidden" }}>
                        <img
                          src={
                            c.image?.startsWith("/uploads")
                              ? `http://localhost:5000${c.image}`
                              : c.image || "https://via.placeholder.com/300x160"
                          }
                          alt={c.title}
                          className="w-100 h-100"
                          style={{ objectFit: "cover" }}
                          onError={(e) => {
                            e.currentTarget.src = "https://via.placeholder.com/300x160?text=Course";
                          }}
                        />
                      </div>
                      <div className="card-body p-3">
                        <span className="badge bg-primary bg-opacity-10 text-primary rounded-pill small fw-semibold mb-2">
                          {c.category || "General"}
                        </span>
                        <h6 className="fw-bold text-dark mb-1">
                          {c.title.length > 30 ? c.title.slice(0, 30) + "…" : c.title}
                        </h6>
                        <p className="text-muted small mb-3">
                          {c.description.length > 60 ? c.description.slice(0, 60) + "…" : c.description}
                        </p>
                        <div className="d-flex align-items-center justify-content-between">
                          <span className="fw-bold text-success small">
                            {c.price === 0 ? "Free" : `Rs. ${c.price}`}
                          </span>
                          <Link
                            to={`/courses/${c._id}`}
                            className="btn btn-outline-primary btn-sm rounded-3 fw-semibold"
                          >
                            View →
                          </Link>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* ══════════════════════════════════════
          ── PAYMENT MODAL ──
          Appears when student clicks Pay button
          on a paid course
      ══════════════════════════════════════ */}
      {showPayment && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
          style={{ background: "rgba(0,0,0,0.6)", zIndex: 9999 }}
          onClick={(e) => { if (e.target === e.currentTarget) setShowPayment(false); }}
        >
          <motion.div
            className="card border-0 shadow-lg rounded-4 overflow-hidden mx-3"
            style={{ width: "100%", maxWidth: 460 }}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Modal Header */}
            <div className="bg-primary text-white p-4 d-flex align-items-center justify-content-between">
              <div>
                <h5 className="fw-bold mb-0">💳 Secure Checkout</h5>
                <small className="opacity-75">{course.title}</small>
              </div>
              <button
                className="btn btn-sm btn-light rounded-3 fw-semibold"
                onClick={() => setShowPayment(false)}
              >
                ✕
              </button>
            </div>

            <div className="card-body p-4">

              {/* Order Summary */}
              <div className="d-flex justify-content-between align-items-center p-3 bg-light rounded-3 mb-4">
                <span className="fw-semibold text-dark small">Order Total</span>
                <span className="fw-bold text-success fs-5">Rs. {course.price}</span>
              </div>

              {/* Card Name */}
              <div className="mb-3">
                <label className="form-label fw-semibold text-dark small text-uppercase">
                  Name on Card
                </label>
                <input
                  className="form-control rounded-3"
                  placeholder="Muhammad Shoaib"
                  value={cardDetails.cardName}
                  onChange={(e) => setCardDetails({ ...cardDetails, cardName: e.target.value })}
                />
              </div>

              {/* Card Number */}
              <div className="mb-3">
                <label className="form-label fw-semibold text-dark small text-uppercase">
                  Card Number
                </label>
                <div className="input-group">
                  <span className="input-group-text bg-light rounded-start-3">💳</span>
                  <input
                    className="form-control rounded-end-3"
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                    value={cardDetails.cardNumber}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, "").slice(0, 16);
                      const formatted = val.replace(/(.{4})/g, "$1 ").trim();
                      setCardDetails({ ...cardDetails, cardNumber: formatted });
                    }}
                  />
                </div>
              </div>

              {/* Expiry + CVV */}
              <div className="row g-3 mb-4">
                <div className="col-6">
                  <label className="form-label fw-semibold text-dark small text-uppercase">
                    Expiry Date
                  </label>
                  <input
                    className="form-control rounded-3"
                    placeholder="MM/YY"
                    maxLength={5}
                    value={cardDetails.expiry}
                    onChange={(e) => {
                      let val = e.target.value.replace(/\D/g, "").slice(0, 4);
                      if (val.length >= 3) val = val.slice(0, 2) + "/" + val.slice(2);
                      setCardDetails({ ...cardDetails, expiry: val });
                    }}
                  />
                </div>
                <div className="col-6">
                  <label className="form-label fw-semibold text-dark small text-uppercase">
                    CVV
                  </label>
                  <input
                    className="form-control rounded-3"
                    placeholder="123"
                    maxLength={3}
                    type="password"
                    value={cardDetails.cvv}
                    onChange={(e) =>
                      setCardDetails({ ...cardDetails, cvv: e.target.value.replace(/\D/g, "").slice(0, 3) })
                    }
                  />
                </div>
              </div>

              {/* Pay Button */}
              <button
                className="btn btn-primary w-100 rounded-3 fw-bold btn-lg"
                onClick={handlePaymentEnroll}
                disabled={processing}
              >
                {processing ? (
                  <><span className="spinner-border spinner-border-sm me-2" />Processing Payment...</>
                ) : (
                  `🔒 Pay Rs. ${course.price} & Enroll`
                )}
              </button>

              <p className="text-center text-muted small mt-3 mb-0">
                🔒 This is a demo payment. No real charge will be made.
              </p>

            </div>
          </motion.div>
        </div>
      )}

    </div>
  );
}

export default CourseDetail;