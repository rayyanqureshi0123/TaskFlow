const { validationResult } = require('express-validator');
const Task = require('../models/Task');

// @route   GET /api/tasks
// @desc    Get all tasks for authenticated user (with search, filter, pagination)
// @access  Private
exports.getTasks = async (req, res) => {
  try {
    const { search, status, page = 1, limit = 10, dueDate } = req.query;
    const query = { userId: req.userId };

    // Filter by status
    if (status && status !== 'all') {
      query.status = status;
    }

    // Filter by dueDate
    if (dueDate) {
      const dateVal = new Date(dueDate);
      if (!isNaN(dateVal.getTime())) {
        const startOfDay = new Date(dueDate);
        startOfDay.setUTCHours(0, 0, 0, 0);
        const endOfDay = new Date(dueDate);
        endOfDay.setUTCHours(23, 59, 59, 999);
        query.dueDate = { $gte: startOfDay, $lte: endOfDay };
      }
    }

    // Search by title
    if (search && search.trim()) {
      query.title = { $regex: search.trim(), $options: 'i' };
    }

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    const [tasks, total] = await Promise.all([
      Task.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Task.countDocuments(query)
    ]);

    res.json({
      tasks,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum)
      }
    });
  } catch (error) {
    console.error('GetTasks error:', error);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
};

// @route   POST /api/tasks
// @desc    Create a new task
// @access  Private
exports.createTask = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: errors.array()[0].msg,
        errors: errors.array()
      });
    }

    const { title, description, status, dueDate, dueTime } = req.body;

    const task = await Task.create({
      title,
      description: description || '',
      status: status || 'pending',
      dueDate: dueDate || null,
      dueTime: dueTime || null,
      userId: req.userId
    });

    res.status(201).json({
      message: 'Task created successfully!',
      task
    });
  } catch (error) {
    console.error('CreateTask error:', error);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
};

// @route   PUT /api/tasks/:id
// @desc    Update a task
// @access  Private
exports.updateTask = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: errors.array()[0].msg,
        errors: errors.array()
      });
    }

    const task = await Task.findOne({ _id: req.params.id, userId: req.userId });
    if (!task) {
      return res.status(404).json({ message: 'Task not found.' });
    }

    const { title, description, status, dueDate, dueTime } = req.body;

    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (status !== undefined) task.status = status;
    if (dueDate !== undefined) task.dueDate = dueDate;
    if (dueTime !== undefined) task.dueTime = dueTime;

    await task.save();

    res.json({
      message: 'Task updated successfully!',
      task
    });
  } catch (error) {
    console.error('UpdateTask error:', error);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
};

// @route   PATCH /api/tasks/:id/toggle
// @desc    Toggle task status between pending and completed
// @access  Private
exports.toggleStatus = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, userId: req.userId });
    if (!task) {
      return res.status(404).json({ message: 'Task not found.' });
    }

    task.status = task.status === 'pending' ? 'completed' : 'pending';
    await task.save();

    res.json({
      message: `Task marked as ${task.status}!`,
      task
    });
  } catch (error) {
    console.error('ToggleStatus error:', error);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
};

// @route   DELETE /api/tasks/:id
// @desc    Delete a task
// @access  Private
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    if (!task) {
      return res.status(404).json({ message: 'Task not found.' });
    }

    res.json({ message: 'Task deleted successfully!' });
  } catch (error) {
    console.error('DeleteTask error:', error);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
};
