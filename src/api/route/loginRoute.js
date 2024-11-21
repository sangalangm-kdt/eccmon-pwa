require("dotenv").config();
const express = require("express");
const jwt = require("jsonwebtoken");
const rateLimit = require("express-rate-limit");
const cookieParser = require("cookie-parser");
const router = express.Router();

const SECRET_KEY = process.env.SECRET_KEY;

if (!SECRET_KEY) {
  throw new Error("SECRET_KEY is not defined in environment variables");
}

const users = [
  { id: 1, email: "test@email.com", name: "ice", password: "pass" },
  { id: 2, email: "ice@ice.com", name: "ice", password: "pass" },
];

// Middleware for login validation
const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }
  next();
};

// // Middleware to verify JWT token
// const verifyToken = (req, res, next) => {
//   const token = req.cookies.token;
//   if (!token) {
//     return res
//       .status(401)
//       .json({ message: "Access denied. No token provided." });
//   }
//   try {
//     const decoded = jwt.verify(token, SECRET_KEY);
//     req.user = decoded;
//     next();
//   } catch (error) {
//     return res.status(400).json({ message: "Invalid token." });
//   }
// };

// Rate limiting middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later",
});

router.use(cookieParser());
router.use(limiter);

router.post("/login", validateLogin, (req, res) => {
  console.log("Login route hit");
  console.log("Request body:", req.body);
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = users.find((u) => u.email === email);

    if (!user) {
      return res.status(404).json({ message: "User does not exist" });
    }

    if (password !== user.password) {
      return res
        .status(401)
        .json({ message: "Email and password do not match" });
    }

    const token = jwt.sign({ email }, SECRET_KEY, { expiresIn: "12h" });
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
    });
    return res.json({
      message: "Logged in successfully",
      token: token, // Return token as a string
      user: { email },
    });
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).json({ message: "Internal server error", error });
  }
});

// Logout route
router.post("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "Strict",
  });
  return res.json({ message: "Logged out successfully" });
});

module.exports = router;
