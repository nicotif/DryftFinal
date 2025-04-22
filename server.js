const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("🚀 Connected to MongoDB"))
  .catch(err => console.error("❌ MongoDB Connection Error:", err));

// Models
const User = mongoose.model("User", new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  preferences: String,
  createdAt: { type: Date, default: Date.now },
}));

const Booking = mongoose.model("Booking", new mongoose.Schema({
  userId: String,
  tripId: String,
  status: String,
  bookingDate: Date,
  paymentId: String,
  createdAt: { type: Date, default: Date.now },
}));

const Payment = mongoose.model("Payment", new mongoose.Schema({
  userId: String,
  amount: Number,
  paymentMethod: String,
  status: String,
  transactionDate: Date,
  receiptUrl: String,
  createdAt: { type: Date, default: Date.now },
}));

// Add this in server.js after the other models
const Profile = mongoose.model("Profile", new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: String,
  username: String,
  bio: String,
  profilePic: String,
  followers: { type: Number, default: 0 },
  following: { type: Number, default: 0 }
}));

// Serve static files from root directory
app.use(express.static(path.join(__dirname)));

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/favicon.ico', (req, res) => res.status(204).end());

app.post('/api/auth/register', async (req, res) => {
  try {
    let { name, email, password, preferences } = req.body;
    // Normalize the email before storing it
    email = email.toLowerCase().trim();
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword, preferences });
    await user.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error registering user" });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    let { email, password } = req.body;
    email = email.toLowerCase().trim();
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: "Error logging in" });
  }
});

app.post('/api/trips/book', async (req, res) => {
  try {
    const { userId, tripId } = req.body;
    const booking = new Booking({ userId, tripId, status: "confirmed", bookingDate: new Date() });
    await booking.save();
    res.json({ message: "Trip booked successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error booking trip" });
  }
});

app.post('/api/payments', async (req, res) => {
  try {
    const { userId, amount, paymentMethod } = req.body;
    const payment = new Payment({
      userId, amount, paymentMethod, status: "success", transactionDate: new Date(),
    });
    await payment.save();
    res.json({ message: "Payment processed successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error processing payment" });
  }
});

// GET /api/profile - Retrieve current user's profile
app.get('/api/profile', authenticateToken, async (req, res) => {
  try {
    console.log("GET /api/profile hit by user:", req.user.userId);
    const userId = req.user.userId;
    let profile = await Profile.findOne({ userId });
    if (!profile) {
      console.log("Profile not found for user:", userId, "Creating default profile.");
      profile = new Profile({
        userId,
        name: "",
        username: "",
        bio: "",
        profilePic: "", // Empty signals that the UI should use the placeholder image
        followers: 0,
        following: 0
      });
      await profile.save();
    }
    res.json(profile);
  } catch (err) {
    console.error("Error retrieving profile:", err.message);
    res.status(500).json({ error: 'Error retrieving profile' });
  }
});

// PUT /api/profile - Update (or create) current user's profile
app.put('/api/profile', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { name, bio, username, profilePic } = req.body;
    let profile = await Profile.findOne({ userId });
    if (!profile) {
      profile = new Profile({ userId, name, bio, username, profilePic });
    } else {
      profile.name = (name !== undefined && name !== null) ? name : profile.name;
      profile.bio = (bio !== undefined && bio !== null) ? bio : profile.bio;
      profile.username = (username !== undefined && username !== null) ? username : profile.username;
      profile.profilePic = (profilePic !== undefined && profilePic !== null) ? profilePic : profile.profilePic;
    }
    await profile.save();
    res.json({ message: 'Profile saved successfully', profile });
  } catch (err) {
    console.error("Error saving profile:", err.message);
    res.status(500).json({ error: 'Error saving profile' });
  }
});

//Get fix 
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    console.log("No token provided");
    return res.status(401).json({ error: "No token provided" });
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.log("Token verification error:", err.message);
      return res.status(403).json({ error: "Token invalid" });
    }
    console.log("Decoded token:", decoded);
    req.user = decoded;
    next();
  });
}

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));