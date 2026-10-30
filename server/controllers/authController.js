const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, email, password, rollNumber, department, role } = req.body;

    if (!name || !email || !password || !rollNumber) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const userExists = await User.findOne({
      $or: [{ email: email.toLowerCase() }, { rollNumber: rollNumber.toUpperCase() }],
    });

    if (userExists) {
      return res.status(400).json({
        message: userExists.email === email.toLowerCase()
          ? 'User with this email already exists'
          : 'User with this roll number already exists',
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      rollNumber: rollNumber.toUpperCase(),
      department: department || 'CSE',
      role: role === 'admin' ? 'admin' : 'student',
    });

    res.status(201).json({
      token: generateToken(user._id),
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        rollNumber: user.rollNumber,
        department: user.department,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Registration error:', error.message);
    res.status(500).json({ message: 'Server error during registration', error: error.message });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if (user && (await user.matchPassword(password))) {
      res.json({
        token: generateToken(user._id),
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          rollNumber: user.rollNumber,
          department: user.department,
          role: user.role,
        },
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('Login error:', error.message);
    res.status(500).json({ message: 'Server error during login', error: error.message });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Protected
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (error) {
    console.error('Get me error:', error.message);
    res.status(500).json({ message: 'Server error fetching user profile' });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
};
