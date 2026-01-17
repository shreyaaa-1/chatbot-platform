require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const protectedRoutes = require("./routes/protectedRoutes");
const projectRoutes = require("./routes/projectRoutes");
const chatRoutes = require("./routes/chatRoutes");
const aiRoutes = require("./routes/aiRoutes");
const cors = require("cors");


const app = express();

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: "*",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);


// Routes
app.use("/auth", authRoutes);
app.use("/protected", protectedRoutes);
app.use("/projects", projectRoutes);
app.use("/chat", chatRoutes);
app.use("/ai", aiRoutes);

// DB + Server start
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
