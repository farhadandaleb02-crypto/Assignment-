import express from "express";
import Assignment from "../models/Assignment.js";
import Submission from "../models/Submission.js";

const router = express.Router();

// ✅ Check login safely
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated && req.isAuthenticated()) {
    return next();
  }
  return res.redirect("/login");
}

// ================= SHOW ASSIGNMENTS =================
router.get("/courses/:courseId/assignments", isLoggedIn, async (req, res) => {
  try {
    const assignments = await Assignment.find({
      course: req.params.courseId,
    });

    res.render("assignments", {
      assignments,
      courseId: req.params.courseId,
    });
  } catch (err) {
    console.log(err);
    res.send("Error loading assignments");
  }
});

// ================= CREATE ASSIGNMENT =================
router.post("/courses/:courseId/assignments", isLoggedIn, async (req, res) => {
  try {
    if (req.user.role !== "teacher" && req.user.role !== "admin") {
      return res.send("Only teacher/admin can create assignment");
    }

    const { title, instructions } = req.body;

    await Assignment.create({
      title,
      instructions,
      course: req.params.courseId,
    });

    res.redirect(`/courses/${req.params.courseId}/assignments`);
  } catch (err) {
    console.log(err);
    res.send("Error creating assignment");
  }
});

// ================= SUBMIT ASSIGNMENT =================
router.post("/assignments/:id/submit", isLoggedIn, async (req, res) => {
  try {
    if (req.user.role !== "student") {
      return res.send("Only students can submit");
    }

    await Submission.create({
      student: req.user._id,
      assignment: req.params.id,
      content: req.body.content,
    });

    res.redirect("/dashboard");
  } catch (err) {
    console.log(err);
    res.send("Error submitting assignment");
  }
});

export default router;