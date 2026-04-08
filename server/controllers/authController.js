const jwt = require('jsonwebtoken');
const User = require('../models/User');

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE || '7d' });

exports.register = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password, specialty, state, npi, role, companyName, contactName } = req.body;

    // Only allow user or pharma roles via public registration
    const safeRole = role === 'pharma' ? 'pharma' : 'user';
    const userData = { firstName, lastName, email, password, role: safeRole };
    if (safeRole === 'user') {
      userData.specialty = specialty;
      userData.state = state;
      userData.npi = npi;
    } else {
      userData.companyName = companyName;
      userData.contactName = contactName;
    }

    const user = await User.create(userData);
    const token = signToken(user._id);
    res.status(201).json({
      success: true,
      token,
      user: { id: user._id, firstName, lastName, email, specialty: user.specialty, state: user.state, role: user.role, companyName: user.companyName }
    });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ success: false, error: 'Email and password are required' });

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.matchPassword(password)))
      return res.status(401).json({ success: false, error: 'Invalid credentials' });

    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    const token = signToken(user._id);
    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        specialty: user.specialty,
        state: user.state,
        role: user.role
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.getMe = async (req, res) => {
  res.json({ success: true, user: req.user });
};
