const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');

// @route   POST /api/auth/register
router.post(
  '/register',
  [
    body('name')
      .trim()
      .notEmpty().withMessage('Name is required.')
      .isLength({ max: 50 }).withMessage('Name cannot exceed 50 characters.'),
    body('email')
      .trim()
      .notEmpty().withMessage('Email is required.')
      .isEmail().withMessage('Please enter a valid email address.'),
    body('password')
      .notEmpty().withMessage('Password is required.')
      .isLength({ min: 6 }).withMessage('Password must be at least 6 characters.')
  ],
  authController.register
);

// @route   POST /api/auth/login
router.post(
  '/login',
  [
    body('email')
      .trim()
      .notEmpty().withMessage('Email is required.')
      .isEmail().withMessage('Please enter a valid email address.'),
    body('password')
      .notEmpty().withMessage('Password is required.')
  ],
  authController.login
);

// @route   GET /api/auth/me
router.get('/me', auth, authController.getMe);

// @route   PUT /api/auth/profile
router.put(
  '/profile',
  auth,
  [
    body('email')
      .optional()
      .trim()
      .isEmail().withMessage('Please enter a valid email address.'),
    body('newPassword')
      .optional()
      .isLength({ min: 6 }).withMessage('New password must be at least 6 characters.'),
    body('currentPassword')
      .notEmpty().withMessage('Current password is required.')
  ],
  authController.updateProfile
);

module.exports = router;
