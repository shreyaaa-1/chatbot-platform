require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const protectedRoutes = require("./routes/protectedRoutes");
const projectRoutes = require("./routes/projectRoutes");
const chatRoutes = require("./routes/chatRoutes");

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use("/auth", authRoutes);
app.use("/protected", protectedRoutes);
app.use("/projects", projectRoutes);
app.use("/chat", chatRoutes);

// DB + Server start
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
