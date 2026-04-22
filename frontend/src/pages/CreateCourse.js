import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

function CreateCourse() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");

  const createCourse = async () => {
    const token = localStorage.getItem("token");
    if (!token) { alert("Please login as instructor"); return; }
    try {
      await axios.post(
        "http://localhost:5000/api/courses",
        { title, description, category, price, image },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Course created successfully");
      setTitle("");
      setDescription("");
      setCategory("");
      setPrice("");
      setImage("");
    } catch (err) {
      alert(err.response?.data?.message || "Error creating course");
    }
  };

  const isFormValid = title && description && category && price;

  return (
    <div className="bg-light min-vh-100">

      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-7 col-md-9">

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >

              {/* ── PAGE HEADER ── */}
              <div className="mb-4">
                <span className="badge bg-primary bg-opacity-10 text-primary rounded-pill px-3 py-2 small fw-semibold mb-2">
                  + New Course
                </span>
                <h2 className="fw-bold text-dark display-6 mb-1">Create a Course</h2>
                <p className="text-muted mb-0">Fill in the details below to publish your course.</p>
              </div>

              {/* ── FORM CARD ── */}
              <div className="card border-0 shadow-sm rounded-4 overflow-hidden">

                {/* Card top accent */}
                <div className="bg-primary" style={{ height: 5 }} />

                <div className="card-body p-4 p-md-5">

                  {/* ── IMAGE PREVIEW ── */}
                  {image && (
                    <motion.div
                      className="mb-4 rounded-4 overflow-hidden border"
                      style={{ height: 180 }}
                      initial={{ opacity: 0, scale: 0.97 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <img
                        src={image}
                        alt="Course preview"
                        className="w-100 h-100"
                        style={{ objectFit: "cover" }}
                        onError={(e) => e.currentTarget.style.display = "none"}
                      />
                    </motion.div>
                  )}

                  {/* ── COURSE TITLE ── */}
                  <div className="mb-4">
                    <label className="form-label fw-semibold text-dark small text-uppercase ls-1">
                      Course Title <span className="text-danger">*</span>
                    </label>
                    <input
                      className="form-control form-control-lg rounded-3 border-1"
                      placeholder="e.g. Complete Web Development Bootcamp"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </div>

                  {/* ── DESCRIPTION ── */}
                  <div className="mb-4">
                    <label className="form-label fw-semibold text-dark small text-uppercase ls-1">
                      Description <span className="text-danger">*</span>
                    </label>
                    <textarea
                      className="form-control rounded-3 border-1"
                      placeholder="What will students learn in this course?"
                      rows={4}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </div>

                  {/* ── CATEGORY + PRICE ROW ── */}
                  <div className="row g-3 mb-4">
                    <div className="col-md-6">
                      <label className="form-label fw-semibold text-dark small text-uppercase">
                        Category <span className="text-danger">*</span>
                      </label>
                      <input
                        className="form-control form-control-lg rounded-3 border-1"
                        placeholder="e.g. Web Development"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold text-dark small text-uppercase">
                        Price (Rs.) <span className="text-danger">*</span>
                      </label>
                      <div className="input-group input-group-lg">
                        <span className="input-group-text rounded-start-3 border-1 bg-light fw-semibold text-muted">
                          Rs.
                        </span>
                        <input
                          type="number"
                          className="form-control rounded-end-3 border-1"
                          placeholder="0"
                          value={price}
                          onChange={(e) => setPrice(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  {/* ── IMAGE URL ── */}
                  <div className="mb-4">
                    <label className="form-label fw-semibold text-dark small text-uppercase">
                      Image URL
                    </label>
                    <div className="input-group input-group-lg">
                      <span className="input-group-text rounded-start-3 border-1 bg-light">
                        🖼️
                      </span>
                      <input
                        className="form-control rounded-end-3 border-1"
                        placeholder="https://example.com/image.jpg"
                        value={image}
                        onChange={(e) => setImage(e.target.value)}
                      />
                    </div>
                    <div className="form-text text-muted small mt-1">
                      Paste an image URL to see a live preview above.
                    </div>
                  </div>

                  <hr className="my-4" />

                  {/* ── SUBMIT BUTTON ── */}
                  <div className="d-grid">
                    <button
                      className={`btn btn-lg rounded-3 fw-semibold ${isFormValid ? "btn-primary" : "btn-secondary"}`}
                      onClick={createCourse}
                      disabled={!isFormValid}
                    >
                      {isFormValid ? "🚀 Publish Course" : "Fill required fields to continue"}
                    </button>
                  </div>

                  {/* ── REQUIRED NOTE ── */}
                  <p className="text-center text-muted small mt-3 mb-0">
                    <span className="text-danger">*</span> Required fields
                  </p>

                </div>
              </div>

            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateCourse;