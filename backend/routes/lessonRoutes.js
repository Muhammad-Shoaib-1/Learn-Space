const express = require("express");
const router = express.Router();
const Lesson = require("../models/Lesson");
const Enrollment = require("../models/Enrollment");
const { protect, authorizeRoles } = require("../middleware/authMiddleware");

// ── GET all lessons for a course ──────────────────────────
// Instructor: always. Student: only if enrolled.
router.get("/:courseId", protect, async (req, res) => {
  try {
    const { courseId } = req.params;

    // If student, verify enrollment
    if (req.user.role === "student") {
      const enrollment = await Enrollment.findOne({
        student: req.user._id,
        course: courseId,
      });
      if (!enrollment) {
        return res.status(403).json({ message: "Enroll in this course to view lessons" });
      }
    }

    const lessons = await Lesson.find({ course: courseId }).sort({ order: 1 });
    res.json(lessons);
  } catch (err) {
    res.status(500).json({ message: "Error fetching lessons" });
  }
});

// ── ADD a lesson (instructor only) ────────────────────────
router.post("/:courseId", protect, authorizeRoles("instructor"), async (req, res) => {
  try {
    const { title, content, videoUrl, duration } = req.body;
    const { courseId } = req.params;

    if (!title) return res.status(400).json({ message: "Lesson title is required" });

    const count = await Lesson.countDocuments({ course: courseId });

    const lesson = new Lesson({
      title,
      content,
      videoUrl,
      duration,
      order: count + 1,
      course: courseId,
    });

    await lesson.save();
    res.status(201).json(lesson);
  } catch (err) {
    res.status(500).json({ message: "Error creating lesson" });
  }
});

// ── UPDATE a lesson (instructor only) ─────────────────────
router.put("/:lessonId", protect, authorizeRoles("instructor"), async (req, res) => {
  try {
    const { title, content, videoUrl, duration } = req.body;

    const lesson = await Lesson.findById(req.params.lessonId);
    if (!lesson) return res.status(404).json({ message: "Lesson not found" });

    lesson.title    = title    ?? lesson.title;
    lesson.content  = content  ?? lesson.content;
    lesson.videoUrl = videoUrl ?? lesson.videoUrl;
    lesson.duration = duration ?? lesson.duration;

    await lesson.save();
    res.json(lesson);
  } catch (err) {
    res.status(500).json({ message: "Error updating lesson" });
  }
});

// ── DELETE a lesson (instructor only) ─────────────────────
router.delete("/:lessonId", protect, authorizeRoles("instructor"), async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.lessonId);
    if (!lesson) return res.status(404).json({ message: "Lesson not found" });

    await Lesson.findByIdAndDelete(req.params.lessonId);
    res.json({ message: "Lesson deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting lesson" });
  }
});

module.exports = router;