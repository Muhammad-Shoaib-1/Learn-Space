const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Test route
app.get("/", (req, res) => {
  res.send("API is running...");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const connectDB = require("./config/db");

connectDB();

const authRoutes = require("./routes/authRoutes");

app.use("/api/auth", authRoutes);

const courseRoutes = require("./routes/courseRoutes");

app.use("/api/courses", courseRoutes);

const enrollmentRoutes = require("./routes/enrollmentRoutes");

app.use("/api/enroll", enrollmentRoutes);