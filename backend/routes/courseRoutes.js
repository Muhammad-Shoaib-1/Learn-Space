const express = require("express");
const Course = require("../models/Course");

const {
  createCourse,
  getCourses,
  getInstructorCourses,
  updateCourse,
  deleteCourse,
} = require("../controllers/courseController");

const { protect, authorizeRoles } = require("../middleware/authMiddleware");

const multer = require("multer");
const path = require("path");

const router = express.Router();

// ================== MULTER CONFIG ==================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// ================== ROUTES ==================

// Get all courses
router.get("/", getCourses);

// Get instructor courses
router.get(
  "/my-courses",
  protect,
  authorizeRoles("instructor"),
  getInstructorCourses
);

// ✅ GET single course by ID (for Course Detail Page)
router.get("/:id", async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate(
      "instructor",
      "name email"
    );
    if (!course) return res.status(404).json({ message: "Course not found" });
    res.json(course);
  } catch (err) {
    res.status(500).json({ message: "Error fetching course" });
  }
});

// CREATE COURSE
router.post(
  "/",
  protect,
  authorizeRoles("instructor"),
  upload.single("image"),
  async (req, res) => {
    try {
      const { title, description, price, category } = req.body;

      const newCourse = new Course({
        title,
        description,
        price,
        category,
        image: req.file ? `/uploads/${req.file.filename}` : "",
        instructor: req.user.id,
      });

      await newCourse.save();
      res.status(201).json(newCourse);
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Error creating course" });
    }
  }
);

// Update course
router.put("/:id", protect, authorizeRoles("instructor"), updateCourse);

// Delete course
router.delete("/:id", protect, authorizeRoles("instructor"), deleteCourse);

module.exports = router;