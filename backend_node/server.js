const express = require("express");
const bcrypt = require("bcrypt");
const cors = require("cors");
const User = require("./schema/User");
const connectDb = require("./db/dbConnection");
const jwt = require("jsonwebtoken");
const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());
// signup route
app.post("/signup", async (req, res) => {
  try {
    const { username, password } = req.body;

    // ✅ Check if email already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).send("Email already registered");
    }

    // ✅ Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(username)) {
      return res.status(400).send("Invalid email format");
    }

    // ✅ Validate password strength
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
    if (!passwordRegex.test(password)) {
      return res
        .status(400)
        .send(
          "Password must have at least 8 characters including uppercase, lowercase, number, and special character"
        );
    }

    // ✅ Hash password (security)
    const bcrypt = require("bcrypt");
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Save user
    const user = new User({ username, password: hashedPassword });
    await user.save();

    res.send("Registration successful");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// 🔹 Sign in route
// 🔹 Sign in route
app.post("/signin", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).send("Invalid username or password");
    }

    // ✅ Compare hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).send("Invalid username or password");
    }

    // 🔐 Create JWT token
    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "1h" }
    );

    res.json({ token }); // send token to frontend
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

connectDb();
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
