const express = require("express");
const {
  createCourse,
  getCourses,
  getInstructorCourses,
  updateCourse,
  deleteCourse,
} = require("../controllers/courseController");

const { protect, authorizeRoles } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", getCourses);

router.get(
  "/my-courses",
  protect,
  authorizeRoles("instructor"),
  getInstructorCourses
);

// Only Instructor or Admin can create course
router.post("/", protect, authorizeRoles("instructor", "admin"), createCourse);

// Update course
router.put(
  "/:id",
  protect,
  authorizeRoles("instructor"),
  updateCourse
);

// Delete course
router.delete(
  "/:id",
  protect,
  authorizeRoles("instructor"),
  deleteCourse
);

module.exports = router;