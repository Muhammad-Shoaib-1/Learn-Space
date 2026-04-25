const express = require("express");
const router = express.Router();
const { protect, authorizeRoles } = require("../middleware/authMiddleware");
const {
  getAllUsers,
  deleteUser,
  getAllCourses,
  deleteCourse,
  getAnalytics,
} = require("../controllers/adminController");

// All routes are protected + admin only
router.use(protect, authorizeRoles("admin"));

router.get("/users", getAllUsers);
router.delete("/users/:id", deleteUser);

router.get("/courses", getAllCourses);
router.delete("/courses/:id", deleteCourse);

router.get("/analytics", getAnalytics);

module.exports = router;