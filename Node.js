const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// DB Connection
mongoose.connect('mongodb://localhost/community_skill_swap', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.log(err));

// User Model
const User = require("./models/User");

// Routes
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/frontend/public/index.html"));
});

// Sign Up Route
app.post("/signup", async (req, res) => {
  const { email, username, password } = req.body;
  const newUser = new User({ email, username, password });
  await newUser.save();
  res.redirect("/login");
});

// Login Route
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email, password });
  if (user) {
    res.redirect("/dashboard");
  } else {
    res.send("Invalid credentials");
  }
});

// Dashboard Route (after login)
app.get("/dashboard", (req, res) => {
  res.sendFile(path.join(__dirname, "/frontend/views/dashboard.ejs"));
});

// Create User Profile
app.post("/create-profile", async (req, res) => {
  const { userId, skills, interests } = req.body;
  // Save skills and interests to user profile
  const user = await User.findById(userId);
  user.skills = skills;
  user.interests = interests;
  await user.save();
  res.redirect("/dashboard");
});

// Server Start
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
