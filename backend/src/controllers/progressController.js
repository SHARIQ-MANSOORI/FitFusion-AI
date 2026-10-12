const mongoose = require('mongoose');
const { z } = require('zod');
const Progress = require('../models/Progress');
const { AppError } = require('../middleware/error');

const progressSchema = z.object({
  weight: z
    .number({ required_error: 'Weight is required' })
    .min(20, 'Weight must be at least 20')
    .max(300, 'Weight must be at most 300'),
  notes: z.string().max(300, 'Notes cannot exceed 300 characters').optional(),
});

// Create new progress record for the authenticated user
const add = async (req, res, next) => {
  try {
    const record = await Progress.create({
      ...req.body,
      user: req.user.id,
    });
    res.status(201).json(record);
  } catch (error) {
    next(error);
  }
};

// Retrieve all progress records owned by the authenticated user, newest first
const mine = async (req, res, next) => {
  try {
    const records = await Progress.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(records);
  } catch (error) {
    next(error);
  }
};

// Update record ensuring user ownership
const update = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      throw new AppError('Invalid ID format', 400);
    }
    const record = await Progress.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true, returnDocument: 'after' }
    );
    if (!record) {
      throw new AppError('Record not found', 404);
    }
    res.status(200).json(record);
  } catch (error) {
    next(error);
  }
};

// Delete record ensuring user ownership
const remove = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      throw new AppError('Invalid ID format', 400);
    }
    const record = await Progress.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });
    if (!record) {
      throw new AppError('Record not found', 404);
    }
    res.status(200).json({ message: 'Deleted' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  progressSchema,
  add,
  mine,
  update,
  remove,
};
