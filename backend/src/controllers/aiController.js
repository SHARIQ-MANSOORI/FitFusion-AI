const { z } = require('zod');
const Workout = require('../models/Workout');
const Diet = require('../models/Diet');
const askGemini = require('../services/gemini');

const workoutSchema = z.object({
  goal: z.string().trim().min(2, 'Goal must be at least 2 characters').max(50, 'Goal cannot exceed 50 characters'),
  weight: z.number().min(20, 'Weight must be at least 20').max(300, 'Weight cannot exceed 300'),
  height: z.number().min(100, 'Height must be at least 100').max(250, 'Height cannot exceed 250'),
  level: z.enum(['Beginner', 'Intermediate', 'Advanced'], {
    errorMap: () => ({ message: 'Level must be Beginner, Intermediate, or Advanced' }),
  }),
});

const dietSchema = z.object({
  goal: z.string().trim().min(2, 'Goal must be at least 2 characters').max(50, 'Goal cannot exceed 50 characters'),
  dietType: z.enum(['Vegetarian', 'Non-Vegetarian', 'Vegan'], {
    errorMap: () => ({ message: 'Diet type must be Vegetarian, Non-Vegetarian, or Vegan' }),
  }),
  calories: z.number().min(1000, 'Calories must be at least 1000').max(5000, 'Calories cannot exceed 5000'),
});

const chatSchema = z.object({
  message: z.string().trim().min(1, 'Message is required').max(500, 'Message cannot exceed 500 characters'),
});

const generateWorkout = async (req, res, next) => {
  try {
    const { goal, weight, height, level } = req.body;
    const prompt = `Create a concise weekly workout plan for a ${level} fitness level individual with a goal of "${goal}". Current weight: ${weight}kg, height: ${height}cm. List day by day with specific exercises, sets, and reps.`;

    const workoutPlan = await askGemini(prompt);

    const workout = await Workout.create({
      user: req.user.id,
      goal,
      workoutPlan,
    });

    res.status(201).json(workout);
  } catch (error) {
    next(error);
  }
};

const generateDiet = async (req, res, next) => {
  try {
    const { goal, dietType, calories } = req.body;
    const prompt = `Create a concise one-day meal plan for a ${dietType} diet targeting ${calories} calories with the goal of "${goal}". List meals with approximate calories and protein.`;

    const dietPlan = await askGemini(prompt);

    const diet = await Diet.create({
      user: req.user.id,
      goal,
      dietPlan,
    });

    res.status(201).json(diet);
  } catch (error) {
    next(error);
  }
};

const askCoach = async (req, res, next) => {
  try {
    const { message } = req.body;
    const prompt = `You are a fitness coach. You must answer only fitness, nutrition, and wellness questions briefly. You must politely decline to answer anything unrelated to fitness, nutrition, or wellness.

User: ${message}`;

    const reply = await askGemini(prompt);

    res.status(200).json({ reply });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  workoutSchema,
  dietSchema,
  chatSchema,
  generateWorkout,
  generateDiet,
  askCoach,
};
