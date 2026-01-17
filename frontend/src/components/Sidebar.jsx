import { useNavigate } from "react-router-dom";

export default function Sidebar({ projects }) {
  const navigate = useNavigate();

  return (
    <aside className="w-64 bg-[#171717] border-r border-gray-800 p-4 flex flex-col">
      <h1 className="text-lg font-semibold mb-4">
        Chatbot Platform
      </h1>

      <button
        onClick={() => navigate("/dashboard")}
        className="mb-4 w-full text-left px-3 py-2 rounded bg-[#2a2a2a] hover:bg-[#333]"
      >
        + New Project
      </button>

      <div className="flex-1 overflow-y-auto space-y-1">
        {projects.map((p) => (
          <button
            key={p._id}
            onClick={() => navigate(`/projects/${p._id}`)}
            className="w-full text-left px-3 py-2 rounded hover:bg-[#2a2a2a]"
          >
            {p.name}
          </button>
        ))}
      </div>

      <button
        onClick={() => {
          localStorage.removeItem("token");
          navigate("/login");
        }}
        className="mt-4 text-sm text-gray-400 hover:text-white"
      >
        Logout
      </button>
    </aside>
  );
}
