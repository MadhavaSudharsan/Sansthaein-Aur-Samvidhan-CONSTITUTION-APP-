const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const multer = require("multer");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
require("dotenv").config();

const app = express();

app.use(bodyParser.json());
app.use(cors());
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Set up multer for file storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret"; // Use environment variable for JWT secret

// Connect to MongoDB
mongoose
  .connect("mongodb://localhost:27017/yourDatabase", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Could not connect to MongoDB", err);
  });

// Define the User schema and model
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const User = mongoose.model("User", userSchema);

// Create a transporter object for nodemailer
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.USER, // Use environment variable for email
    pass: process.env.APP_PASSWORD, // Use environment variable for email password
  },
  tls: {
    rejectUnauthorized: false,
  },
});

// Signup route
app.post("/signup", async (req, res) => {
  const { username, email, password, phone } = req.body;

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists!" });
    }

    const newUser = new User({ username, email, password, phone });
    await newUser.save();
    res.status(201).json({ message: "User registered successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Error registering user", error });
  }
});

// Login route
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: "Invalid username or password!" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid username or password!" });
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET);
    res.json({ message: "Login successful!", token });
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error });
  }
});

// Middleware to authenticate token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Access denied!" });

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: "Invalid token!" });
    req.user = decoded;
    next();
  });
};

// Send OTP route
app.post("/send-otp", (req, res) => {
  const email = req.body.email;
  const otp_val = Math.floor(100000 + Math.random() * 900000); // Generate a 6-digit OTP

  const mailOptions = {
    from: {
      name: "CARGO QUANTUM",
      address: process.env.USER,
    },
    to: email,
    subject: "OTP VERIFICATION ✓",
    text: `Thank you for choosing Cargo Quantum. Here is your OTP for registration: ${otp_val}`,
    html: `<p>Thank you for choosing Sansthaein Aur Samvidhan. Here is your OTP for registration: <strong>${otp_val}</strong></p>`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(500).json({ success: false, message: "Failed to send OTP", error });
    }
    res.status(200).json({ success: true, otp: otp_val });
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
