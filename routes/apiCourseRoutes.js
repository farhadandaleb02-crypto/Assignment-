import express from "express";
import Course from "../models/Course.js";

const router = express.Router();

// GET all courses
router.get("/api/courses", async (req, res) => {
  const courses = await Course.find().populate("teacher");
  res.json(courses);
});

// GET one course
router.get("/api/courses/:id", async (req, res) => {
  const course = await Course.findById(req.params.id).populate("teacher");

  if (!course) {
    return res.status(404).json({ message: "Course not found" });
  }

  res.json(course);
});

// POST create course
router.post("/api/courses", async (req, res) => {
  const course = await Course.create(req.body);
  res.status(201).json(course);
});

// PUT update course
router.put("/api/courses/:id", async (req, res) => {
  const course = await Course.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  if (!course) {
    return res.status(404).json({ message: "Course not found" });
  }

  res.json(course);
});

// DELETE course
router.delete("/api/courses/:id", async (req, res) => {
  const course = await Course.findByIdAndDelete(req.params.id);

  if (!course) {
    return res.status(404).json({ message: "Course not found" });
  }

  res.json({ message: "Course deleted successfully" });
});

export default router;