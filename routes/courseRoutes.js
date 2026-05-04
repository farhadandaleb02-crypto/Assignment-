import express from "express";
import Course from "../models/Course.js";

const router = express.Router();

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  return res.redirect("/login");
}

function isTeacherOrAdmin(req, res, next) {
  if (req.user.role === "teacher" || req.user.role === "admin") return next();
  res.send("Access denied. Only teacher or admin can do this.");
}

// Show all courses
router.get("/courses", isLoggedIn, async (req, res) => {
  const courses = await Course.find().populate("teacher");
  res.render("courses", { courses });
});

// New course form
router.get("/courses/new", isLoggedIn, isTeacherOrAdmin, (req, res) => {
  res.render("create-course");
});

// Create course
router.post("/courses", isLoggedIn, isTeacherOrAdmin, async (req, res) => {
  const { title, description, category, videoUrl } = req.body;

  await Course.create({
    title,
    description,
    category,
    videoUrl,
    teacher: req.user._id,
  });

  res.redirect("/courses");
});

// Edit form
router.get("/courses/:id/edit", isLoggedIn, isTeacherOrAdmin, async (req, res) => {
  const course = await Course.findById(req.params.id);
  res.render("edit-course", { course });
});

// Update course
router.post("/courses/:id", isLoggedIn, isTeacherOrAdmin, async (req, res) => {
  const { title, description, category, videoUrl } = req.body;

  await Course.findByIdAndUpdate(req.params.id, {
    title,
    description,
    category,
    videoUrl,
  });

  res.redirect("/courses");
});

// Delete course
router.post("/courses/:id/delete", isLoggedIn, isTeacherOrAdmin, async (req, res) => {
  await Course.findByIdAndDelete(req.params.id);
  res.redirect("/courses");
});

export default router;