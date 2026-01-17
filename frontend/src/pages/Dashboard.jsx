import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [newName, setNewName] = useState("");
  const [newPrompt, setNewPrompt] = useState("");
  const [creating, setCreating] = useState(false);

  const navigate = useNavigate();

  // Fetch projects on load
  useEffect(() => {
    api
      .get("/projects")
      .then((res) => setProjects(res.data))
      .catch(() => setError("Failed to load projects"))
      .finally(() => setLoading(false));
  }, []);

  const handleCreateProject = async (e) => {
    e.preventDefault();
    setCreating(true);
    setError("");

    try {
      const res = await api.post("/projects", {
        name: newName,
        systemPrompt: newPrompt,
      });

      setProjects((prev) => [...prev, res.data]);
      setNewName("");
      setNewPrompt("");
    } catch {
      setError("Failed to create project");
    } finally {
      setCreating(false);
    }
  };

  if (loading) {
    return <p>Loading projects...</p>;
  }

  return (
   <div className="flex-1 flex items-center justify-center">
  <div className="text-center max-w-md">
    <h2 className="text-2xl font-semibold mb-2">
      Create a new AI agent
    </h2>
    <p className="text-gray-400 mb-6">
      Give your agent a name and a system prompt to define its behavior.
    </p>

    <form
      onSubmit={handleCreateProject}
      className="space-y-3"
    >
      <input
        className="w-full bg-[#1e1e1e] border border-gray-700 rounded px-3 py-2"
        placeholder="Project name"
        value={newName}
        onChange={(e) => setNewName(e.target.value)}
        required
      />

      <textarea
        className="w-full bg-[#1e1e1e] border border-gray-700 rounded px-3 py-2"
        placeholder="System prompt (optional)"
        value={newPrompt}
        onChange={(e) => setNewPrompt(e.target.value)}
      />

      <button
        type="submit"
        className="w-full bg-white text-black py-2 rounded font-medium"
      >
        Create
      </button>
    </form>
  </div>
</div>
  );
}
