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
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
  {messages.map((msg, i) => (
    <div
      key={i}
      className={`max-w-3xl ${
        msg.role === "user"
          ? "ml-auto text-right"
          : "mr-auto"
      }`}
    >
      <div
        className={`inline-block px-4 py-3 rounded-lg text-sm leading-relaxed ${
          msg.role === "user"
            ? "bg-[#2f2f2f]"
            : "bg-[#1f1f1f]"
        }`}
      >
        {msg.content}
      </div>
    </div>
  ))}

  {sending && (
    <p className="text-gray-500 text-sm">
      Assistant is thinking…
    </p>
  )}
</div>
      {/* Input */}
      <div className="border-t border-gray-800 p-4">
  <div className="max-w-3xl mx-auto flex gap-2">
    <input
      className="flex-1 bg-[#1e1e1e] border border-gray-700 rounded px-4 py-3"
      placeholder="Send a message…"
      value={input}
      onChange={(e) => setInput(e.target.value)}
      onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
      disabled={sending}
    />

    <button
      onClick={handleSendMessage}
      disabled={sending}
      className="bg-white text-black px-4 py-3 rounded"
    >
      Send
    </button>
  </div>
</div>

    </div>
  );
}
