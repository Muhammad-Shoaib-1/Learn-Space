const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    category: {
      type: String,
    },
    price: {
      type: Number,
      default: 0,
    },
    image: {
    type: String,
    default: "https://via.placeholder.com/300x200"
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Course", courseSchema);