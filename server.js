import express from "express";
import mongoose from "mongoose";
import session from "express-session";
import passport from "passport";
import LocalStrategy from "passport-local";
import path from "path";
import { fileURLToPath } from "url";

import User from "./models/User.js";
import authRoutes from "./routes/authRoutes.js";
import courseRoutes from "./routes/courseRoutes.js";
import assignmentRoutes from "./routes/assignmentRoutes.js";
import apiCourseRoutes from "./routes/apiCourseRoutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Session
app.use(
  session({
    secret: "secretkey",
    resave: false,
    saveUninitialized: false,
  })
);

// Passport
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Current user for EJS pages
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});

// MongoDB
mongoose
  .connect("mongodb://127.0.0.1:27017/course_portal")
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// Routes
app.use("/", authRoutes);
app.use("/", courseRoutes);
app.use("/", assignmentRoutes);
app.use("/", apiCourseRoutes);


app.get("/", (req, res) => {
  res.render("index");
});

app.get("/dashboard", (req, res) => {
  if (!req.isAuthenticated()) {
    return res.redirect("/login");
  }

  res.render("dashboard");
});

// Server
app.listen(3000, () => {
  console.log("Server running on port 3000");
});