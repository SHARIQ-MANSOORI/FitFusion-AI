const mongoose = require('mongoose');

const dietSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    goal: {
      type: String,
    },
    dietPlan: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Diet = mongoose.model('Diet', dietSchema);

module.exports = Diet;
