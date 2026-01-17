# AI Chatbot Platform (Full Stack)

A full-stack AI chatbot platform where users can create multiple AI agents (projects), define custom system prompts for each agent, and chat with them.  
The application supports authentication, project isolation per user, persistent chat history, and AI responses using a free LLM provider.

---

## 🚀 Features

### Authentication
- User registration and login
- JWT-based authentication
- Protected routes (frontend + backend)
- Logout functionality

### Projects (AI Agents)
- Create multiple projects (agents)
- Each project has:
  - A name
  - A custom system prompt
- Projects are isolated per user

### Chat & AI Integration
- Persistent chat history per project
- User and assistant messages stored in database
- AI responses generated using a free LLM via OpenRouter
- Simple chat UI with loading state

---

## 🏗️ Tech Stack

### Backend
- **Node.js**
- **Express.js**
- **MongoDB** (Mongoose)
- **JWT** for authentication
- **OpenRouter API** (free LLM models)
- **Axios**
- **CORS**

### Frontend
- **React** (Vite)
- **JavaScript**
- **React Router**
- **Axios**
- **Tailwind CSS**

---

## 📂 Project Structure

```
chatbot-platform/
│
├── backend/
│ ├── src/
│ │ ├── config/
│ │ │ ├── db.js
│ │ │ └── llmClient.js
│ │ ├── controllers/
│ │ ├── middleware/
│ │ ├── models/
│ │ ├── routes/
│ │ └── app.js
│ └── package.json
│
├── frontend/
│ ├── src/
│ │ ├── api/
│ │ ├── auth/
│ │ ├── components/
│ │ ├── pages/
│ │ ├── router/
│ │ ├── App.jsx
│ │ └── main.jsx
│ └── package.json
│
└── README.md
```


---

## 🔐 Environment Variables

Create a `.env` file inside the **backend** folder:

---

## 🔐 Environment Variables

Create a `.env` file inside the **backend** folder:

```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
OPENROUTER_API_KEY=your_openrouter_api_key
PORT=5000
```


⚠️ Never commit `.env` files.

---

## ▶️ How to Run the Project Locally

### 1️⃣ Backend Setup

```bash
cd backend
npm install
npm start
```

The backend server will run on:
```
http://localhost:5000
```


## 2️⃣ Frontend Setup

    cd frontend
    npm install
    npm run dev

Frontend runs on:
    http://localhost:5173

---

## 🔄 API Overview (Backend)

### Authentication APIs
- POST /auth/register – Register a new user
- POST /auth/login – Login and receive JWT token

### Project APIs (Authenticated)
- GET /projects – List user projects
- POST /projects – Create project
- GET /projects/:id – Get project details
- PUT /projects/:id – Update project
- DELETE /projects/:id – Delete project

### Chat & AI APIs (Authenticated)
- GET /chat/:projectId/messages – Fetch chat history
- POST /ai/:projectId/chat – Send message and get AI reply

---

## 🧠 Architecture Overview

    Frontend (React + Vite)
            ↓
    Axios (JWT)
            ↓
    Backend (Node + Express)
            ↓
    MongoDB
            ↓
    OpenRouter (Free LLM)
