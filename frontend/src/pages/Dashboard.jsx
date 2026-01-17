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
    <div>
      <h2 className="text-xl font-semibold mb-4">Your Projects</h2>

      {error && (
        <p className="text-red-500 text-sm mb-3">{error}</p>
      )}

      {/* Create Project */}
      <form
        onSubmit={handleCreateProject}
        className="bg-white p-4 rounded shadow mb-6"
      >
        <h3 className="font-medium mb-2">Create New Project</h3>

        <input
          type="text"
          placeholder="Project name"
          className="w-full border p-2 mb-2"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          required
        />

        <textarea
          placeholder="System prompt (optional)"
          className="w-full border p-2 mb-3"
          value={newPrompt}
          onChange={(e) => setNewPrompt(e.target.value)}
        />

        <button
          type="submit"
          disabled={creating}
          className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {creating ? "Creating..." : "Create Project"}
        </button>
      </form>

      {/* Project List */}
      {projects.length === 0 ? (
        <p>No projects yet.</p>
      ) : (
        <ul className="space-y-2">
          {projects.map((project) => (
            <li
              key={project._id}
              onClick={() => navigate(`/projects/${project._id}`)}
              className="bg-white p-3 rounded shadow cursor-pointer hover:bg-gray-50"
            >
              <p className="font-medium">{project.name}</p>
              {project.systemPrompt && (
                <p className="text-sm text-gray-600 truncate">
                  {project.systemPrompt}
                </p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
