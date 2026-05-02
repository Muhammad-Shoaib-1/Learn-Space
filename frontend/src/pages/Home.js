import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";

function Home() {
  const [courseCount, setCourseCount] = useState(0);

  useEffect(() => {
    // Fetch course count for stats
    axios.get("https://learnspace-backend-u9ng.onrender.com/api/courses")
      .then((res) => setCourseCount(res.data.length))
      .catch(() => setCourseCount(0));
  }, []);

  const features = [
    { icon: "🎓", title: "Expert Instructors", desc: "Learn from industry professionals with real-world experience." },
    { icon: "📱", title: "Learn Anywhere", desc: "Access your courses anytime, on any device, at your own pace." },
    { icon: "📜", title: "Track Progress", desc: "Monitor your learning journey with detailed progress tracking." },
    { icon: "🚀", title: "Career Growth", desc: "Gain skills that are in demand and boost your career instantly." },
    { icon: "💬", title: "Community", desc: "Join thousands of learners and grow together as a community." },
    { icon: "🔒", title: "Secure Platform", desc: "Your data and learning journey are always safe with us." },
  ];

  const steps = [
    { num: "01", title: "Create an Account", desc: "Register as a student or instructor in under a minute." },
    { num: "02", title: "Browse Courses",    desc: "Explore a wide range of courses across multiple categories." },
    { num: "03", title: "Enroll & Learn",    desc: "Enroll in your chosen course and start learning immediately." },
    { num: "04", title: "Track & Grow",      desc: "Monitor your progress and level up your skills." },
  ];

  const testimonials = [
    { name: "Sara Ahmed",   role: "Web Developer",     text: "LearnSpace completely changed my career. The courses are practical and the instructors are amazing!", avatar: "SA", color: "#0d6efd" },
    { name: "Usman Khan",   role: "Student",            text: "I enrolled in the MERN course and got a job within 3 months. Best investment I ever made.", avatar: "UK", color: "#198754" },
    { name: "Zara Malik",   role: "UI/UX Designer",     text: "The platform is clean, easy to use, and the content quality is top notch. Highly recommended!", avatar: "ZM", color: "#6f42c1" },
  ];

  const fadeUp = {
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.5 },
  };

  return (
    <div className="bg-white">

      {/* ══════════════ HERO ══════════════ */}
      <section className="bg-primary text-white py-5">
        <div className="container py-4">
          <div className="row align-items-center g-5">
            <motion.div
              className="col-lg-6"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="badge bg-white text-primary rounded-pill px-3 py-2 fw-semibold small mb-3 d-inline-block">
                🚀 #1 Learning Platform in Pakistan
              </span>
              <h1 className="display-4 fw-bold mb-3 lh-sm">
                Unlock Your <span className="text-warning">Potential</span> with LearnSpace
              </h1>
              <p className="lead mb-4 opacity-75">
                Join thousands of students learning in-demand skills from expert instructors.
                Start your journey today — completely at your own pace.
              </p>
              <div className="d-flex gap-3 flex-wrap">
                <Link to="/register" className="btn btn-warning btn-lg rounded-3 fw-bold px-4 text-dark">
                  Get Started Free →
                </Link>
                <Link to="/courses" className="btn btn-outline-light btn-lg rounded-3 fw-semibold px-4">
                  Browse Courses
                </Link>
              </div>

              {/* Mini stats */}
              <div className="d-flex gap-4 mt-5 flex-wrap">
                {[
                  { value: `${courseCount}+`, label: "Courses" },
                  { value: "500+",            label: "Students" },
                  { value: "50+",             label: "Instructors" },
                  { value: "4.9★",            label: "Rating" },
                ].map((s, i) => (
                  <div key={i}>
                    <div className="fw-bold fs-4">{s.value}</div>
                    <div className="small opacity-75">{s.label}</div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              className="col-lg-6 d-none d-lg-block"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {/* Illustrated card stack */}
              <div className="position-relative" style={{ height: 360 }}>
                {/* Main card */}
                <div className="card border-0 shadow-lg rounded-4 p-4 position-absolute"
                  style={{ width: 300, top: 20, left: 60, zIndex: 3, background: "#fff" }}>
                  <div className="d-flex align-items-center gap-3 mb-3">
                    <div className="bg-primary bg-opacity-10 rounded-3 d-flex align-items-center justify-content-center"
                      style={{ width: 44, height: 44 }}><span className="fs-5">📘</span></div>
                    <div>
                      <div className="fw-bold text-dark small">MERN Stack Course</div>
                      <div className="text-muted" style={{ fontSize: 12 }}>by Ali Hassan</div>
                    </div>
                  </div>
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <span className="small text-muted fw-semibold">Progress</span>
                    <span className="badge bg-success rounded-pill small">72%</span>
                  </div>
                  <div className="progress rounded-pill" style={{ height: 7 }}>
                    <div className="progress-bar bg-success rounded-pill" style={{ width: "72%" }} />
                  </div>
                  <div className="d-flex gap-2 mt-3">
                    <span className="badge bg-primary bg-opacity-10 text-primary rounded-pill small">Web Dev</span>
                    <span className="badge bg-warning bg-opacity-25 text-warning rounded-pill small">Rs. 500</span>
                  </div>
                </div>

                {/* Behind card 1 */}
                <div className="card border-0 shadow rounded-4 p-3 position-absolute"
                  style={{ width: 260, top: 160, left: 10, zIndex: 2, background: "#f0f7ff" }}>
                  <div className="d-flex align-items-center gap-2">
                    <span className="fs-5">🐍</span>
                    <div>
                      <div className="fw-semibold text-dark small">Python Development</div>
                      <div className="text-muted" style={{ fontSize: 11 }}>142 students enrolled</div>
                    </div>
                  </div>
                </div>

                {/* Behind card 2 */}
                <div className="card border-0 shadow rounded-4 p-3 position-absolute"
                  style={{ width: 220, top: 240, left: 140, zIndex: 1, background: "#f0fff4" }}>
                  <div className="d-flex align-items-center gap-2">
                    <span className="fs-5">🛡️</span>
                    <div>
                      <div className="fw-semibold text-dark small">Cyber Security</div>
                      <div className="text-muted" style={{ fontSize: 11 }}>97 students enrolled</div>
                    </div>
                  </div>
                </div>

                {/* Floating badge */}
                <div className="card border-0 shadow-lg rounded-3 px-3 py-2 position-absolute d-flex align-items-center gap-2"
                  style={{ top: 0, right: 20, zIndex: 4, background: "#fff" }}>
                  <span className="text-success fw-bold">✓</span>
                  <span className="small fw-semibold text-dark">New enrollment!</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══════════════ FEATURES ══════════════ */}
      <section className="py-5 bg-light">
        <div className="container py-4">
          <motion.div className="text-center mb-5" {...fadeUp}>
            <span className="badge bg-primary bg-opacity-10 text-primary rounded-pill px-3 py-2 fw-semibold small mb-2">
              Why LearnSpace?
            </span>
            <h2 className="fw-bold display-6 text-dark">Everything You Need to Succeed</h2>
            <p className="text-muted">A complete learning platform built for modern learners and instructors.</p>
          </motion.div>

          <div className="row g-4">
            {features.map((f, i) => (
              <motion.div
                className="col-md-6 col-lg-4"
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
              >
                <div className="card border-0 shadow-sm rounded-4 h-100 p-4">
                  <div className="fs-2 mb-3">{f.icon}</div>
                  <h5 className="fw-bold text-dark mb-2">{f.title}</h5>
                  <p className="text-muted small mb-0">{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════ HOW IT WORKS ══════════════ */}
      <section className="py-5 bg-white">
        <div className="container py-4">
          <motion.div className="text-center mb-5" {...fadeUp}>
            <span className="badge bg-success bg-opacity-10 text-success rounded-pill px-3 py-2 fw-semibold small mb-2">
              Simple Process
            </span>
            <h2 className="fw-bold display-6 text-dark">How It Works</h2>
            <p className="text-muted">Get started in just 4 simple steps.</p>
          </motion.div>

          <div className="row g-4">
            {steps.map((s, i) => (
              <motion.div
                className="col-md-6 col-lg-3"
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
              >
                <div className="text-center px-3">
                  <div
                    className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold fs-5 mx-auto mb-3"
                    style={{ width: 60, height: 60 }}
                  >
                    {s.num}
                  </div>
                  {/* Connector line except last */}
                  <h5 className="fw-bold text-dark mb-2">{s.title}</h5>
                  <p className="text-muted small">{s.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════ STATS BANNER ══════════════ */}
      <section className="py-5 bg-primary text-white">
        <motion.div className="container py-2" {...fadeUp}>
          <div className="row g-4 text-center">
            {[
              { value: "500+",  label: "Happy Students",     icon: "🎓" },
              { value: `${courseCount}+`, label: "Available Courses", icon: "📚" },
              { value: "50+",   label: "Expert Instructors", icon: "🧑‍🏫" },
              { value: "98%",   label: "Satisfaction Rate",  icon: "⭐" },
            ].map((s, i) => (
              <div className="col-6 col-md-3" key={i}>
                <div className="fs-2 mb-2">{s.icon}</div>
                <h2 className="fw-bold mb-1">{s.value}</h2>
                <p className="opacity-75 mb-0 small">{s.label}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ══════════════ TESTIMONIALS ══════════════ */}
      <section className="py-5 bg-light">
        <div className="container py-4">
          <motion.div className="text-center mb-5" {...fadeUp}>
            <span className="badge bg-warning bg-opacity-25 text-warning rounded-pill px-3 py-2 fw-semibold small mb-2">
              Student Reviews
            </span>
            <h2 className="fw-bold display-6 text-dark">What Our Students Say</h2>
            <p className="text-muted">Real feedback from real learners.</p>
          </motion.div>

          <div className="row g-4">
            {testimonials.map((t, i) => (
              <motion.div
                className="col-md-4"
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
              >
                <div className="card border-0 shadow-sm rounded-4 h-100 p-4">
                  {/* Stars */}
                  <div className="text-warning mb-3" style={{ fontSize: 18 }}>★★★★★</div>
                  <p className="text-muted small flex-grow-1 mb-4">"{t.text}"</p>
                  <div className="d-flex align-items-center gap-3">
                    <div
                      className="rounded-circle text-white d-flex align-items-center justify-content-center fw-bold flex-shrink-0"
                      style={{ width: 42, height: 42, background: t.color, fontSize: 14 }}
                    >
                      {t.avatar}
                    </div>
                    <div>
                      <div className="fw-bold text-dark small">{t.name}</div>
                      <div className="text-muted" style={{ fontSize: 12 }}>{t.role}</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════ CTA ══════════════ */}
      <section className="py-5 bg-white">
        <motion.div className="container py-4 text-center" {...fadeUp}>
          <div className="card border-0 rounded-4 p-5 shadow-sm" style={{ background: "linear-gradient(135deg, #0d6efd 0%, #6610f2 100%)" }}>
            <h2 className="fw-bold text-white display-6 mb-3">
              Ready to Start Learning?
            </h2>
            <p className="text-white opacity-75 mb-4 lead">
              Join thousands of students already learning on LearnSpace.
            </p>
            <div className="d-flex gap-3 justify-content-center flex-wrap">
              <Link to="/register" className="btn btn-warning btn-lg rounded-3 fw-bold px-5 text-dark">
                Join For Free →
              </Link>
              <Link to="/courses" className="btn btn-outline-light btn-lg rounded-3 fw-semibold px-5">
                View Courses
              </Link>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ══════════════ FOOTER ══════════════ */}
      <footer className="bg-dark text-white py-5">
        <div className="container">
          <div className="row g-4 mb-4">
            <div className="col-md-4">
              <div className="d-flex align-items-center gap-2 mb-3">
                <span className="bg-primary text-white rounded-2 px-2 py-1 small fw-bold">LS</span>
                <span className="fw-bold fs-5">LearnSpace</span>
              </div>
              <p className="text-white opacity-50 small">
                A modern learning management system built with the MERN stack. Empowering learners and instructors across Pakistan.
              </p>
            </div>
            <div className="col-md-2 offset-md-2">
              <h6 className="fw-bold mb-3">Platform</h6>
              <ul className="list-unstyled">
                {[
                  { label: "Courses",   to: "/courses"  },
                  { label: "Dashboard", to: "/dashboard" },
                  { label: "Register",  to: "/register" },
                  { label: "Login",     to: "/login"    },
                ].map((l) => (
                  <li key={l.label} className="mb-2">
                    <Link to={l.to} className="text-white opacity-50 text-decoration-none small" style={{ transition: "opacity .2s" }}
                      onMouseEnter={(e) => e.target.style.opacity = 1}
                      onMouseLeave={(e) => e.target.style.opacity = 0.5}
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="col-md-3">
              <h6 className="fw-bold mb-3">Roles</h6>
              <ul className="list-unstyled">
                {["🎓 Student", "🧑‍🏫 Instructor", "🛡️ Admin"].map((r) => (
                  <li key={r} className="mb-2 text-white opacity-50 small">{r}</li>
                ))}
              </ul>
            </div>
          </div>
          <hr className="border-secondary" />
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
            <p className="text-white opacity-50 small mb-0">© 2025 LearnSpace. Built with MERN Stack.</p>
            <p className="text-white opacity-50 small mb-0">Made with ❤️ in Pakistan</p>
          </div>
        </div>
      </footer>

    </div>
  );
}

export default Home;