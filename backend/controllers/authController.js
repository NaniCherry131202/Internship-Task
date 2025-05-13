const User = require('../models/User');
const jwt = require('jsonwebtoken');

exports.signup = async (req, res) => {
  const { email, password, name, country } = req.body;
  try {
    console.log('Signup request:', { email, name, country });
    const user = new User({ email, password, name, country });
    await user.save();
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(201).json({ token, user: { id: user._id, email, name, country } });
  } catch (err) {
    console.error('Signup error:', err.message);
    res.status(400).json({ message: err.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  console.log('Login request:', { email });

  try {
    // Validate request body
    if (!email || !password) {
      console.log('Validation failed: Email or password missing');
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find user
    console.log('Finding user...');
    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found:', email);
      return res.status(401).json({ message: 'User not found' });
    }

    // Check password
    console.log('Validating password...');
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      console.log('Invalid password for user:', email);
      return res.status(401).json({ message: 'Invalid password' });
    }

    // Generate token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    console.log('Token generated for user:', email);
    res.json({
      token,
      user: { id: user._id, email: user.email, name: user.name, country: user.country },
    });
  } catch (err) {
    console.error('Login error:', err.message);
    res.status(400).json({ message: 'Login failed: ' + err.message });
  }
};