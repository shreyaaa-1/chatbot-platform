const ChatMessage = require("../models/ChatMessage");
const Project = require("../models/Project");

// SAVE A MESSAGE
exports.addMessage = async (req, res) => {
  try {
    const { content, role } = req.body;
    const projectId = req.params.projectId;

    if (!content || !role) {
      return res.status(400).json({ message: "Content and role are required" });
    }

    // Verify project ownership
    const project = await Project.findOne({
      _id: projectId,
      owner: req.user.userId,
    });

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const message = await ChatMessage.create({
      project: projectId,
      owner: req.user.userId,
      role,
      content,
    });

    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// GET CHAT HISTORY
exports.getMessages = async (req, res) => {
  try {
    const projectId = req.params.projectId;

    // Ownership check
    const project = await Project.findOne({
      _id: projectId,
      owner: req.user.userId,
    });

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const messages = await ChatMessage.find({
      project: projectId,
      owner: req.user.userId,
    }).sort({ createdAt: 1 });

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
