const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
// Other imports and configurations

const secretKey = process.env.SECRET_KEY;
const refreshSecretKey = process.env.REFRESH_SECRET_KEY;
const resetSecretKey = process.env.RESET_SECRET_KEY;
const app = express();
const PORT = process.env.PORT || 3000;

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/node-mongodb-rest')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// User Model
const User = mongoose.model('User', {
  email: String,
  password: String,
});

// Middleware
app.use(bodyParser.json());

// Routes
// User Signup
app.post('/signup', async (req, res) => {
  console.log('req ', req);
  try {
    const { email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashedPassword });
    await user.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// User Login
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    const accessToken = jwt.sign({ email: user.email }, secretKey, { expiresIn: '1h' });
    res.json({ accessToken });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Password Reset Request
app.post('/reset-password-request', async (req, res) => {
    try {
      const { email } = req.body;
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      // Generate a token for password reset
      const resetToken = jwt.sign({ email: user.email }, resetSecretKey, { expiresIn: '1h' });
      // Send the reset token to the user via email or any other method
      // For simplicity, let's just respond with the reset token in this example
      res.json({ resetToken });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  // Password Reset
  app.post('/reset-password', async (req, res) => {
    try {
      const { resetToken, newPassword } = req.body;
      // Verify the reset token
      jwt.verify(resetToken, resetSecretKey, async (err, decoded) => {
        if (err) {
          return res.status(401).json({ error: 'Invalid or expired reset token' });
        }
        const { email } = decoded;
        const user = await User.findOne({ email });
        if (!user) {
          return res.status(404).json({ error: 'User not found' });
        }
        // Update user's password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();
        res.json({ message: 'Password reset successful' });
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Token Refresh
app.post('/token-refresh', (req, res) => {
    const refreshToken = req.body.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ error: 'Refresh token is required' });
    }
    // Verify refresh token and generate a new access token
    jwt.verify(refreshToken, refreshSecretKey, (err, decoded) => {
      if (err) {
        return res.status(403).json({ error: 'Invalid or expired refresh token' });
      }
      const accessToken = jwt.sign({ email: decoded.email }, 'secret_key', { expiresIn: '1h' });
      res.json({ accessToken });
    });
  });
  

// Sample Protected Route (Requires Authentication)
app.get('/protected', authenticateToken, (req, res) => {
  res.json({ message: 'Protected Route Accessed' });
});

// Middleware to verify JWT Token
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);
  
  jwt.verify(token, secretKey, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

// Start Server
app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));
