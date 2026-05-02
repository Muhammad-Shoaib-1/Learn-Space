const express = require("express");
const router = express.Router();
const { protect, authorizeRoles } = require("../middleware/authMiddleware");
const {
  getAllUsers,
  deleteUser,
  resetUserPassword,
  getAllCourses,
  deleteCourse,
  getAnalytics,
} = require("../controllers/adminController");

// All routes protected + admin only
router.use(protect, authorizeRoles("admin"));

router.get("/users", getAllUsers);
router.delete("/users/:id", deleteUser);
router.put("/users/:id/reset-password", resetUserPassword);  // 🔑 new

router.get("/courses", getAllCourses);
router.delete("/courses/:id", deleteCourse);

router.get("/analytics", getAnalytics);

module.exports = router;