const express = require("express");
const Enrollment = require("../models/Enrollment");

const {
  enrollCourse,
  getMyCourses,
  updateProgress,
  getEnrolledStudents,
  getCourseAnalytics
} = require("../controllers/enrollmentController");

const {
  protect,
  authorizeRoles,
} = require("../middleware/authMiddleware");

const router = express.Router();

// ✅ Enroll in course
router.post("/", protect, authorizeRoles("student"), enrollCourse);

// ✅ Get my courses
router.get("/my-courses", protect, getMyCourses);

// ✅ Update progress
router.put(
  "/progress/:id",
  protect,
  authorizeRoles("student"),
  updateProgress
);

router.get(
  "/course/:courseId",
  protect,
  authorizeRoles("instructor"),
  getEnrolledStudents
);

router.get(
  "/analytics/:courseId",
  protect,
  authorizeRoles("instructor"),
  getCourseAnalytics
);

// 🔥 UNENROLL COURSE
router.delete("/:id", async (req, res) => {
  try {
    const courseId = req.params.id;

    console.log("Deleting courseId:", courseId);

    const enrollment = await Enrollment.findOneAndDelete({
      course: courseId,
    });

    if (!enrollment) {
      return res.status(404).json({ message: "Enrollment not found" });
    }

    res.json({ message: "Course removed successfully" });

  } catch (err) {
  console.log("DELETE ERROR FULL:", err);
  res.status(500).json({ message: err.message });
}
});

module.exports = router;