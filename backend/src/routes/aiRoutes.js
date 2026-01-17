const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const aiController = require("../controllers/aiController");

router.use(authMiddleware);

router.post("/:projectId/chat", aiController.chatWithAI);

module.exports = router;
