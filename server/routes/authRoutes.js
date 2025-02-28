// routes/authRoutes.js
const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

const SECRET_KEY = 'mySecretKey'; // Dummy secret for signing tokens

router.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Dummy authentication logic: for demonstration only
  if (username === 'admin' && password === 'admin123') {
    // For admin user, assign role "admin"
    const token = jwt.sign({ username, role: 'admin' }, SECRET_KEY, { expiresIn: '1h' });
    return res.json({ token });
  } else if (username === 'user' && password === 'user123') {
    // For normal user, assign role "user"
    const token = jwt.sign({ username, role: 'user' }, SECRET_KEY, { expiresIn: '1h' });
    return res.json({ token });
  } else {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
});

module.exports = router;
