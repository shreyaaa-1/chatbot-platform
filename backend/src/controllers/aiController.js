const llmClient = require("../config/llmClient");
const Project = require("../models/Project");
const ChatMessage = require("../models/ChatMessage");

exports.chatWithAI = async (req, res) => {
  try {
    const { message } = req.body;
    const { projectId } = req.params;

    if (!message) {
      return res.status(400).json({ message: "Message is required" });
    }

    // 1. Verify project ownership
    const project = await Project.findOne({
      _id: projectId,
      owner: req.user.userId,
    });

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // 2. Save user message
    await ChatMessage.create({
      project: projectId,
      owner: req.user.userId,
      role: "user",
      content: message,
    });

    // 3. Fetch conversation history
    const history = await ChatMessage.find({
      project: projectId,
      owner: req.user.userId,
    }).sort({ createdAt: 1 });

    // 4. Build messages array for LLM
    const messages = [];

    if (project.systemPrompt) {
      messages.push({
        role: "system",
        content: project.systemPrompt,
      });
    }

    history.forEach((msg) => {
      messages.push({
        role: msg.role,
        content: msg.content,
      });
    });

    // 5. Call OpenRouter (FREE MODEL)
    const response = await llmClient.post("/chat/completions", {
      model: "mistralai/mistral-7b-instruct",
      messages: messages,
      temperature: 0.7,
    });

    const assistantReply =
      response.data.choices[0].message.content;

    // 6. Save assistant message
    await ChatMessage.create({
      project: projectId,
      owner: req.user.userId,
      role: "assistant",
      content: assistantReply,
    });

    // 7. Return response
    res.json({ reply: assistantReply });

  } catch (error) {
    console.error("AI ERROR:", error.response?.data || error.message);
    res.status(500).json({ message: "AI response failed" });
  }
};
