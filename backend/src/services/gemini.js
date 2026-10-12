const { GoogleGenerativeAI } = require('@google/generative-ai');
const { AppError } = require('../middleware/error');

const askGemini = async (prompt) => {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: process.env.GEMINI_MODEL });

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    if (!text || !text.trim()) {
      throw new AppError('AI service unavailable, try again later', 502);
    }

    return text.trim();
  } catch (err) {
    if (err instanceof AppError) {
      throw err;
    }
    console.error(err.message);
    throw new AppError('AI service unavailable, try again later', 502);
  }
};

module.exports = askGemini;
module.exports.askGemini = askGemini;
