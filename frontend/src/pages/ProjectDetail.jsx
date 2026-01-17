import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";

export default function ProjectDetail() {
  const { id } = useParams();

  const [project, setProject] = useState(null);
  const [systemPrompt, setSystemPrompt] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);

  // Load project + chat history
  useEffect(() => {
    const loadData = async () => {
      try {
        const projectRes = await api.get(`/projects/${id}`);
        setProject(projectRes.data);
        setSystemPrompt(projectRes.data.systemPrompt || "");

        const chatRes = await api.get(`/chat/${id}/messages`);
        setMessages(chatRes.data);
      } catch {
        setError("Failed to load project");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  const handleSavePrompt = async () => {
    setSaving(true);
    setError("");

    try {
      const res = await api.put(`/projects/${id}`, {
        systemPrompt,
      });
      setProject(res.data);
    } catch {
      setError("Failed to save system prompt");
    } finally {
      setSaving(false);
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = {
      role: "user",
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setSending(true);

    try {
      const res = await api.post(`/ai/${id}/chat`, {
        message: userMessage.content,
      });

      const assistantMessage = {
        role: "assistant",
        content: res.data.reply,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch {
      setError("Failed to get AI response");
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return <p>Loading project...</p>;
  }

  if (!project) {
    return <p>Project not found</p>;
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">
        {project.name}
      </h2>

      {error && (
        <p className="text-red-500 text-sm mb-3">
          {error}
        </p>
      )}

      {/* System Prompt */}
      <div className="bg-white p-4 rounded shadow mb-6">
        <h3 className="font-medium mb-2">System Prompt</h3>

        <textarea
          className="w-full border p-2 min-h-[120px]"
          value={systemPrompt}
          onChange={(e) => setSystemPrompt(e.target.value)}
        />

        <button
          onClick={handleSavePrompt}
          disabled={saving}
          className="mt-3 bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Prompt"}
        </button>
      </div>

      {/* Chat */}
      <div className="bg-white p-4 rounded shadow">
        <h3 className="font-medium mb-3">Chat</h3>

        <div className="border p-3 mb-3 h-64 overflow-y-auto space-y-2">
          {messages.length === 0 ? (
            <p className="text-sm text-gray-500">
              No messages yet.
            </p>
          ) : (
            messages.map((msg, index) => (
              <div
                key={index}
                className={`p-2 rounded text-sm ${
                  msg.role === "user"
                    ? "bg-blue-100 text-right"
                    : "bg-gray-100 text-left"
                }`}
              >
                {msg.content}
              </div>
            ))
          )}

          {sending && (
            <p className="text-sm text-gray-400 italic">
              AI is thinking…
            </p>
          )}
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            className="flex-1 border p-2"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message…"
            disabled={sending}
          />

          <button
            onClick={handleSendMessage}
            disabled={sending}
            className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
