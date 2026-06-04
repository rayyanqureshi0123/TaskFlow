const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const taskController = require('../controllers/taskController');
const auth = require('../middleware/auth');

// All routes are protected
router.use(auth);

// @route   GET /api/tasks
router.get('/', taskController.getTasks);

// @route   POST /api/tasks
router.post(
  '/',
  [
    body('title')
      .trim()
      .notEmpty().withMessage('Task title is required.')
      .isLength({ max: 100 }).withMessage('Title cannot exceed 100 characters.'),
    body('description')
      .optional()
      .trim()
      .isLength({ max: 500 }).withMessage('Description cannot exceed 500 characters.'),
    body('status')
      .optional()
      .isIn(['pending', 'completed']).withMessage('Status must be pending or completed.'),
    body('dueDate')
      .optional({ nullable: true })
      .isISO8601().withMessage('Due date must be a valid date.')
  ],
  taskController.createTask
);

// @route   PUT /api/tasks/:id
router.put(
  '/:id',
  [
    body('title')
      .optional()
      .trim()
      .notEmpty().withMessage('Task title cannot be empty.')
      .isLength({ max: 100 }).withMessage('Title cannot exceed 100 characters.'),
    body('description')
      .optional()
      .trim()
      .isLength({ max: 500 }).withMessage('Description cannot exceed 500 characters.'),
    body('status')
      .optional()
      .isIn(['pending', 'completed']).withMessage('Status must be pending or completed.'),
    body('dueDate')
      .optional({ nullable: true })
      .isISO8601().withMessage('Due date must be a valid date.')
  ],
  taskController.updateTask
);

// @route   PATCH /api/tasks/:id/toggle
router.patch('/:id/toggle', taskController.toggleStatus);

// @route   DELETE /api/tasks/:id
router.delete('/:id', taskController.deleteTask);

module.exports = router;
