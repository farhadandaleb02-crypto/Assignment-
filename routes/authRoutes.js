import express from "express";
import passport from "passport";
import User from "../models/User.js";

const router = express.Router();

router.get("/register", (req, res) => {
  res.render("register");
});

router.post("/register", async (req, res) => {
  try {
    const { username, password, name, role } = req.body;
    const newUser = new User({ username, name, role });

    await User.register(newUser, password);

    res.redirect("/login");
  } catch (err) {
    console.log(err);
    res.send("Error registering user");
  }
});

router.get("/login", (req, res) => {
  res.render("login");
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/login",
  })
);

router.get("/logout", (req, res) => {
  req.logout(() => {
    res.redirect("/");
  });
});

export default router;