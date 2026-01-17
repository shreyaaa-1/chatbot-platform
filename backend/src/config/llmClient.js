const axios = require("axios");

const llmClient = axios.create({
  baseURL: "https://openrouter.ai/api/v1",
  headers: {
    Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
    "Content-Type": "application/json",
    "HTTP-Referer": "http://localhost:5000", // required by OpenRouter
    "X-Title": "Chatbot Platform Project",
  },
});

module.exports = llmClient;
