import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const API = "http://localhost:5000/api";

function Courses() {
  const [courses, setCourses] = useState([]);
  const [enrolledIds, setEnrolledIds] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [enrollingId, setEnrollingId] = useState(null);

  // ── Payment modal state ──
  const [showPayment, setShowPayment] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [cardDetails, setCardDetails] = useState({
    cardName: "", cardNumber: "", expiry: "", cvv: "",
  });

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

  // ── Direct enroll (free courses) ──
  const enrollCourse = async (courseId) => {
    const token = localStorage.getItem("token");
    if (!token) { toast.error("Please login first"); return; }

    try {
      setEnrollingId(courseId);
      await axios.post(
        `${API}/enroll`,
        { courseId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEnrolledIds((prev) => [...prev, courseId]);
      toast.success("Enrolled successfully! 🎉");
    } catch (err) {
      toast.error(err.response?.data?.message || "Error enrolling");
    } finally {
      setEnrollingId(null);
    }
  };

  // ── Handle enroll button click ──
  const handleEnrollClick = (course) => {
    const token = localStorage.getItem("token");
    if (!token) { toast.error("Please login first"); return; }

    if (course.price === 0) {
      // Free → enroll directly
      enrollCourse(course._id);
    } else {
      // Paid → open payment modal
      setSelectedCourse(course);
      setCardDetails({ cardName: "", cardNumber: "", expiry: "", cvv: "" });
      setShowPayment(true);
    }
  };

  // ── Payment modal enroll ──
  const handlePaymentEnroll = async () => {
    if (!cardDetails.cardName || !cardDetails.cardNumber ||
        !cardDetails.expiry || !cardDetails.cvv) {
      toast.warning("Please fill all payment fields");
      return;
    }
    if (cardDetails.cardNumber.replace(/\s/g, "").length < 16) {
      toast.warning("Enter a valid 16-digit card number");
      return;
    }

    const token = localStorage.getItem("token");
    setProcessing(true);

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000));

    try {
      await axios.post(
        `${API}/enroll`,
        { courseId: selectedCourse._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEnrolledIds((prev) => [...prev, selectedCourse._id]);
      setShowPayment(false);
      setSelectedCourse(null);
      toast.success("Payment successful! Enrolled 🎉");
    } catch (err) {
      toast.error(err.response?.data?.message || "Error enrolling");
    } finally {
      setProcessing(false);
    }
  };

  const filteredCourses = courses.filter((course) =>
    course.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-light min-vh-100">

      {/* ── HERO ── */}
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
                  <button className="btn btn-light" onClick={() => setSearch("")}>✕</button>
                )}
              </div>
            </div>

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

        {/* ── COURSE GRID ── */}
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
                <div style={{ height: 190, overflow: "hidden" }}>
                  <img
                    src={`http://localhost:5000${course.image}`}
                    alt={course.title}
                    className="w-100 h-100"
                    style={{ objectFit: "cover" }}
                    onError={(e) => {
                      e.currentTarget.src = "https://via.placeholder.com/300x190?text=Course";
                    }}
                  />
                </div>

                <div className="card-body d-flex flex-column p-4">

                  <h5 className="fw-bold text-dark mb-2">{course.title}</h5>

                  <p className="text-muted small flex-grow-1 mb-3">
                    {course.description.length > 80
                      ? course.description.slice(0, 80) + "…"
                      : course.description}
                  </p>

                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="fw-bold text-success fs-5">
                      {course.price === 0 ? "Free" : `Rs. ${course.price}`}
                    </span>

                    {enrolledIds.includes(course._id) ? (
                      <button className="btn btn-success rounded-3 fw-semibold" disabled>
                        ✅ Enrolled
                      </button>
                    ) : (
                      <button
                        className="btn btn-primary rounded-3 fw-semibold"
                        disabled={enrollingId === course._id}
                        onClick={() => handleEnrollClick(course)}
                      >
                        {enrollingId === course._id
                          ? <><span className="spinner-border spinner-border-sm me-1" />Enrolling...</>
                          : course.price === 0
                          ? "Enroll Free 🚀"
                          : `Pay & Enroll 💳`}
                      </button>
                    )}
                  </div>

                  <Link
                    to={`/courses/${course._id}`}
                    className="btn btn-outline-secondary btn-sm rounded-3 fw-semibold w-100"
                  >
                    View Details →
                  </Link>

                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════
          ── PAYMENT MODAL ──
      ══════════════════════════════════════ */}
      {showPayment && selectedCourse && (
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
                <small className="opacity-75">{selectedCourse.title}</small>
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
                <span className="fw-bold text-success fs-5">Rs. {selectedCourse.price}</span>
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
                  `🔒 Pay Rs. ${selectedCourse.price} & Enroll`
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

export default Courses;