import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

function About() {
  const fadeUp = {
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.5 },
  };

  const stats = [
    { value: "500+", label: "Students Enrolled", icon: "🎓" },
    { value: "50+",  label: "Expert Instructors", icon: "🧑‍🏫" },
    { value: "30+",  label: "Courses Available",  icon: "📚" },
    { value: "98%",  label: "Satisfaction Rate",  icon: "⭐" },
  ];

  const values = [
    {
      icon: "🎯",
      title: "Our Mission",
      desc: "To make quality education accessible to everyone in Pakistan and beyond — regardless of background, location, or financial status.",
    },
    {
      icon: "🔭",
      title: "Our Vision",
      desc: "A world where every learner has access to industry-level skills and every instructor can share their knowledge with thousands.",
    },
    {
      icon: "💡",
      title: "Our Approach",
      desc: "We believe in learning by doing. Every course on LearnSpace is built around real-world projects and practical experience.",
    },
  ];

  const team = [
    { name: "Muhammad Shoaib", role: "Full Stack Developer & Founder", initials: "MS", color: "#0d6efd" },
    { name: "Ali Hassan",       role: "Lead Instructor — Web Dev",      initials: "AH", color: "#198754" },
    { name: "Zara Malik",       role: "Course Designer & Instructor",   initials: "ZM", color: "#6f42c1" },
  ];

  const techStack = [
    { name: "MongoDB",    icon: "🍃", desc: "Database"        },
    { name: "Express.js", icon: "⚡", desc: "Backend API"     },
    { name: "React JS",   icon: "⚛️", desc: "Frontend UI"    },
    { name: "Node.js",    icon: "🟢", desc: "Server Runtime"  },
    { name: "JWT",        icon: "🔐", desc: "Authentication"  },
    { name: "Bootstrap",  icon: "🎨", desc: "UI Framework"    },
  ];

  return (
    <div className="bg-white">

      {/* ── HERO ── */}
      <section className="bg-dark text-white py-5">
        <motion.div
          className="container py-4 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="badge bg-primary rounded-pill px-3 py-2 fw-semibold small mb-3 d-inline-block">
            🏫 About LearnSpace
          </span>
          <h1 className="display-4 fw-bold mb-3">
            We're on a Mission to <span className="text-warning">Transform</span> Education
          </h1>
          <p className="lead opacity-75 mb-4 mx-auto" style={{ maxWidth: 600 }}>
            LearnSpace is a full-stack Learning Management System built with the MERN stack,
            designed to connect passionate instructors with eager learners across Pakistan.
          </p>
          <div className="d-flex gap-3 justify-content-center flex-wrap">
            <Link to="/courses" className="btn btn-primary btn-lg rounded-3 fw-semibold px-4">
              Browse Courses →
            </Link>
            <Link to="/register" className="btn btn-outline-light btn-lg rounded-3 fw-semibold px-4">
              Join For Free
            </Link>
          </div>
        </motion.div>
      </section>

      {/* ── STATS ── */}
      <section className="py-5 bg-primary text-white">
        <motion.div className="container py-2" {...fadeUp}>
          <div className="row g-4 text-center">
            {stats.map((s, i) => (
              <div className="col-6 col-md-3" key={i}>
                <div className="fs-2 mb-2">{s.icon}</div>
                <h2 className="fw-bold mb-1">{s.value}</h2>
                <p className="opacity-75 small mb-0">{s.label}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ── OUR STORY ── */}
      <section className="py-5 bg-light">
        <div className="container py-4">
          <div className="row align-items-center g-5">
            <motion.div
              className="col-lg-6"
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <span className="badge bg-success bg-opacity-10 text-success rounded-pill px-3 py-2 fw-semibold small mb-3 d-inline-block">
                📖 Our Story
              </span>
              <h2 className="fw-bold display-6 text-dark mb-4">
                Built by a Student, <br />For Students
              </h2>
              <p className="text-muted mb-3" style={{ lineHeight: 1.9 }}>
                LearnSpace was born as a Final Year Project for a MERN Stack Web Development course.
                The goal was simple — build something real, something useful, something that solves
                an actual problem in the education space.
              </p>
              <p className="text-muted mb-3" style={{ lineHeight: 1.9 }}>
                What started as an academic project quickly grew into a fully functional LMS platform
                with role-based access, course management, lesson uploads, progress tracking,
                and a complete admin panel — all built from scratch using industry-standard technologies.
              </p>
              <p className="text-muted mb-0" style={{ lineHeight: 1.9 }}>
                Today, LearnSpace stands as a demonstration of what a dedicated MERN developer
                can build — a production-ready application that reflects real-world development practices.
              </p>
            </motion.div>

            <motion.div
              className="col-lg-6"
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="card border-0 shadow-sm rounded-4 p-4">
                <h6 className="fw-bold text-dark mb-4">🏆 Project Highlights</h6>
                <div className="d-flex flex-column gap-3">
                  {[
                    { icon: "✅", text: "Complete MERN Stack implementation" },
                    { icon: "✅", text: "3 role-based dashboards (Student, Instructor, Admin)" },
                    { icon: "✅", text: "JWT Authentication & Bcrypt password hashing" },
                    { icon: "✅", text: "RESTful API with full CRUD operations" },
                    { icon: "✅", text: "Course & Lesson management system" },
                    { icon: "✅", text: "Student enrollment & progress tracking" },
                    { icon: "✅", text: "Admin analytics dashboard" },
                    { icon: "✅", text: "Responsive UI with Bootstrap 5" },
                  ].map((item, i) => (
                    <div key={i} className="d-flex align-items-center gap-3">
                      <span className="text-success fw-bold">{item.icon}</span>
                      <span className="text-muted small">{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── VALUES ── */}
      <section className="py-5 bg-white">
        <div className="container py-4">
          <motion.div className="text-center mb-5" {...fadeUp}>
            <span className="badge bg-primary bg-opacity-10 text-primary rounded-pill px-3 py-2 fw-semibold small mb-2">
              💎 What We Stand For
            </span>
            <h2 className="fw-bold display-6 text-dark">Our Core Values</h2>
          </motion.div>

          <div className="row g-4">
            {values.map((v, i) => (
              <motion.div
                className="col-md-4"
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
              >
                <div className="card border-0 shadow-sm rounded-4 h-100 p-4 text-center">
                  <div className="fs-1 mb-3">{v.icon}</div>
                  <h5 className="fw-bold text-dark mb-2">{v.title}</h5>
                  <p className="text-muted small mb-0" style={{ lineHeight: 1.8 }}>{v.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TECH STACK ── */}
      <section className="py-5 bg-light">
        <div className="container py-4">
          <motion.div className="text-center mb-5" {...fadeUp}>
            <span className="badge bg-warning bg-opacity-25 text-warning rounded-pill px-3 py-2 fw-semibold small mb-2">
              🛠️ Technologies
            </span>
            <h2 className="fw-bold display-6 text-dark">Built With MERN Stack</h2>
            <p className="text-muted">Industry-standard technologies used to build LearnSpace.</p>
          </motion.div>

          <div className="row g-3 justify-content-center">
            {techStack.map((tech, i) => (
              <motion.div
                className="col-6 col-md-4 col-lg-2"
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.07 }}
              >
                <div className="card border-0 shadow-sm rounded-4 p-3 text-center h-100">
                  <div className="fs-2 mb-2">{tech.icon}</div>
                  <div className="fw-bold text-dark small">{tech.name}</div>
                  <div className="text-muted" style={{ fontSize: 11 }}>{tech.desc}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TEAM ── */}
      <section className="py-5 bg-white">
        <div className="container py-4">
          <motion.div className="text-center mb-5" {...fadeUp}>
            <span className="badge bg-danger bg-opacity-10 text-danger rounded-pill px-3 py-2 fw-semibold small mb-2">
              👥 The Team
            </span>
            <h2 className="fw-bold display-6 text-dark">Meet the People Behind LearnSpace</h2>
          </motion.div>

          <div className="row g-4 justify-content-center">
            {team.map((member, i) => (
              <motion.div
                className="col-md-4"
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
              >
                <div className="card border-0 shadow-sm rounded-4 p-4 text-center h-100">
                  <div
                    className="rounded-circle text-white d-flex align-items-center justify-content-center fw-bold mx-auto mb-3"
                    style={{ width: 70, height: 70, fontSize: 22, background: member.color }}
                  >
                    {member.initials}
                  </div>
                  <h6 className="fw-bold text-dark mb-1">{member.name}</h6>
                  <p className="text-muted small mb-0">{member.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-5 bg-light">
        <motion.div className="container py-4 text-center" {...fadeUp}>
          <div
            className="card border-0 rounded-4 p-5 shadow-sm text-white"
            style={{ background: "linear-gradient(135deg, #0d6efd 0%, #6610f2 100%)" }}
          >
            <h2 className="fw-bold display-6 mb-3">Ready to Start Your Journey?</h2>
            <p className="opacity-75 lead mb-4">
              Join LearnSpace today and take the first step toward your goals.
            </p>
            <div className="d-flex gap-3 justify-content-center flex-wrap">
              <Link to="/register" className="btn btn-warning btn-lg rounded-3 fw-bold px-5 text-dark">
                Get Started Free →
              </Link>
              <Link to="/courses" className="btn btn-outline-light btn-lg rounded-3 fw-semibold px-5">
                Browse Courses
              </Link>
            </div>
          </div>
        </motion.div>
      </section>

    </div>
  );
}

export default About;