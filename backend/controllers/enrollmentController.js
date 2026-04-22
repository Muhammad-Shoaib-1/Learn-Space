const Enrollment = require("../models/Enrollment");

// Enroll in course
exports.enrollCourse = async (req, res) => {
  try {
    const { courseId } = req.body;

    const enrollment = await Enrollment.create({
      student: req.user.id,
      course: courseId,
    });

    res.status(201).json(enrollment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get my courses
exports.getMyCourses = async (req, res) => {
  try {
    const courses = await Enrollment.find({ student: req.user.id })
      .populate("course");

    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateProgress = async (req, res) => {
  try {
    const enrollmentId = req.params.id;
    const { progress } = req.body;

    // 1. Validate input
    if (progress === undefined) {
      return res.status(400).json({
        message: "Progress is required",
      });
    }

    if (progress < 0 || progress > 100) {
      return res.status(400).json({
        message: "Progress must be between 0 and 100",
      });
    }

    // 2. Find enrollment
    const enrollment = await Enrollment.findById(enrollmentId);

    if (!enrollment) {
      return res.status(404).json({
        message: "Enrollment not found",
      });
    }

    // 3. Check ownership (VERY IMPORTANT)
    if (enrollment.student.toString() !== req.user.id) {
      return res.status(403).json({
        message: "You can only update your own progress",
      });
    }

    // 4. Update progress
    enrollment.progress = progress;

    await enrollment.save();

    // 5. Send response
    res.status(200).json({
      message: "Progress updated successfully",
      enrollment,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

exports.getEnrolledStudents = async (req, res) => {
  try {
    const courseId = req.params.courseId;

    // Find enrollments for this course
    const enrollments = await Enrollment.find({ course: courseId })
      .populate("student", "name email") // show student info
      .populate("course", "title");

    res.status(200).json(enrollments);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

exports.getCourseAnalytics = async (req, res) => {
  try {
    const courseId = req.params.courseId;

    const enrollments = await Enrollment.find({ course: courseId });

    const totalStudents = enrollments.length;

    const totalProgress = enrollments.reduce(
      (sum, e) => sum + e.progress,
      0
    );

    const avgProgress =
      totalStudents === 0 ? 0 : totalProgress / totalStudents;

    res.json({
      totalStudents,
      avgProgress: avgProgress.toFixed(2),
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};