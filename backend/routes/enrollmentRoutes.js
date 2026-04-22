const express = require("express");

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

module.exports = router;