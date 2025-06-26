import express from 'express';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';

const router = express.Router();

// -------------------- SIGNUP --------------------
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = await User.create({ name, email, password: hashedPassword });

    // Save user in session
    req.session.user = { id: newUser._id, name: newUser.name };
    res.status(201).json({ message: 'Signup successful', user: req.session.user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// -------------------- LOGIN --------------------
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Save user in session
    req.session.user = { id: user._id, name: user.name };
    res.status(200).json({ message: 'Login successful', user: req.session.user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// -------------------- LOGOUT --------------------
router.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) return res.status(500).json({ message: 'Logout failed' });
    res.clearCookie('connect.sid'); // Adjust cookie name if changed
    res.status(200).json({ message: 'Logged out successfully' });
  });
});

// -------------------- CHECK SESSION --------------------
router.get('/check-auth', (req, res) => {
  if (req.session && req.session.user) {
    res.json({ loggedIn: true, user: req.session.user });
  } else {
    res.json({ loggedIn: false });
  }
});

export default router;
