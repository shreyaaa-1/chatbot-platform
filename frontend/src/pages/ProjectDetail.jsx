import { useEffect, useState, useRef } from "react";
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
  const bottomRef = useRef(null);
  const [showPrompt, setShowPrompt] = useState(false);


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

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, sending]);

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
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">
          {project.name}
        </h2>

        <button
          onClick={() => setShowPrompt((prev) => !prev)}
          className="text-sm text-gray-400 hover:text-white border border-gray-700 px-3 py-1 rounded"
        >
          {showPrompt ? "Hide system prompt" : "Edit system prompt"}
        </button>
      </div>


      {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

      {/* System Prompt */}
      {showPrompt && (
        <div className="bg-[#111] border border-gray-800 p-4 rounded mb-6">
          <h3 className="font-medium mb-2">
            System Prompt
          </h3>

          <textarea
            className="w-full bg-[#1e1e1e] border border-gray-700 rounded px-3 py-2 text-sm text-gray-200 min-h-[120px]"
            value={systemPrompt}
            onChange={(e) => setSystemPrompt(e.target.value)}
            placeholder="Define how the AI should behave..."
          />

          <button
            onClick={handleSavePrompt}
            disabled={saving}
            className="mt-3 bg-white text-black px-4 py-2 rounded font-medium"
          >
            {saving ? "Saving..." : "Save Prompt"}
          </button>
        </div>
      )}

      {/* Chat Container */}
      <div className="flex flex-col h-[calc(100vh-180px)]">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`max-w-3xl ${
                msg.role === "user" ? "ml-auto text-right" : "mr-auto"
              }`}
            >
              <div
                className={`inline-block px-4 py-3 rounded-lg text-sm leading-relaxed ${
                  msg.role === "user" ? "bg-[#2f2f2f]" : "bg-[#1f1f1f]"
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}

          {sending && (
            <p className="text-gray-500 text-sm">Assistant is thinking…</p>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Fixed Input */}
        <div className="border-t border-gray-800 p-4 bg-[#0f0f0f]">
          <div className="max-w-3xl mx-auto flex gap-2">
            <input
              className="flex-1 bg-[#1e1e1e] border border-gray-700 rounded px-4 py-3 text-sm text-gray-200 focus:outline-none"
              placeholder="Send a message…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              disabled={sending}
            />

            <button
              onClick={handleSendMessage}
              disabled={sending}
              className="bg-white text-black px-4 py-3 rounded font-medium"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
