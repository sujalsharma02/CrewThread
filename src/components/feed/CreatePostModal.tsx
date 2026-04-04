"use client";
import { useState } from "react";
import { X, Image, BarChart2, Smile, MapPin, Briefcase, Code2, Zap } from "lucide-react";

const POST_TYPES = [
  { value: "normal", label: "Post" },
  { value: "job", label: "🏢 Hiring", icon: Briefcase },
  { value: "project", label: "💻 Project", icon: Code2 },
  { value: "event", label: "⚡ Event", icon: Zap },
];

interface CreatePostModalProps {
  onClose: () => void;
  onCreated?: (post: any) => void;
}

export default function CreatePostModal({ onClose, onCreated }: CreatePostModalProps) {
  const [content, setContent] = useState("");
  const [type, setType] = useState("normal");
  const [tags, setTags] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!content.trim()) return;
    setLoading(true);
    setError("");
    try {
      const usersRes = await fetch("/api/users");
      const usersData = await usersRes.json();
      const authorId = usersData.users?.[0]?._id;

      if (!authorId) {
        setError("Please load demo data first (click 'Demo Data' on the home page)");
        setLoading(false);
        return;
      }

      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          authorId,
          content,
          type,
          tags: tags.split(",").map((t) => t.trim().replace("#", "")).filter(Boolean),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      onCreated?.(data.post);
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to create post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-12 px-4" onClick={onClose}>
      <div className="absolute inset-0 bg-white/10 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-[600px] rounded-2xl p-4 animate-slide-up"
        style={{ backgroundColor: "#000", border: "1px solid #2f3336" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="p-2 rounded-full hover:bg-white/10 transition-colors mb-2"
          style={{ color: "#e7e9ea" }}
        >
          <X className="w-5 h-5" />
        </button>

        {/* Type selector */}
        <div className="flex gap-2 mb-4 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
          {POST_TYPES.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setType(value)}
              className="flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-semibold transition-all"
              style={
                type === value
                  ? { background: "linear-gradient(135deg, #6366f1, #a855f7)", color: "#fff" }
                  : { backgroundColor: "#16181c", color: "#71767b", border: "1px solid #2f3336" }
              }
            >
              {label}
            </button>
          ))}
        </div>

        {/* Composer row */}
        <div className="flex gap-3">
          <img
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=sujal"
            alt="You"
            className="w-11 h-11 rounded-full flex-shrink-0"
            style={{ backgroundColor: "#1e2227" }}
          />
          <div className="flex-1">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={
                type === "job" ? "Share a job opening... e.g. 'Hiring React Devs – Remote – ₹12 LPA'"
                  : type === "project" ? "Post a project... e.g. 'MERN dashboard in 7 days – ₹15,000'"
                  : "What's happening?"
              }
              className="w-full bg-transparent outline-none resize-none text-xl placeholder:text-zinc-600"
              style={{ color: "#e7e9ea", minHeight: 100 }}
              autoFocus
              maxLength={1000}
            />

            {/* Tags input */}
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="#tags (comma separated)"
              className="w-full bg-transparent outline-none text-sm mt-1"
              style={{ color: "#6366f1" }}
            />
          </div>
        </div>

        {error && <p className="text-sm mt-2 px-14" style={{ color: "#ef4444" }}>{error}</p>}

        {/* Footer */}
        <div className="flex items-center justify-between mt-4 pt-4" style={{ borderTop: "1px solid #2f3336" }}>
          <div className="flex gap-1 ml-14" style={{ color: "#6366f1" }}>
            <button className="p-2 rounded-full hover:bg-indigo-500/10 transition-colors"><Image className="w-5 h-5" /></button>
            <button className="p-2 rounded-full hover:bg-indigo-500/10 transition-colors"><BarChart2 className="w-5 h-5" /></button>
            <button className="p-2 rounded-full hover:bg-indigo-500/10 transition-colors"><Smile className="w-5 h-5" /></button>
            <button className="p-2 rounded-full hover:bg-indigo-500/10 transition-colors"><MapPin className="w-5 h-5" /></button>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs" style={{ color: content.length > 900 ? "#f59e0b" : "#71767b" }}>
              {content.length}/1000
            </span>
            <button
              onClick={handleSubmit}
              disabled={!content.trim() || loading}
              className="px-5 py-1.5 rounded-full font-bold text-sm text-white disabled:opacity-50 hover:opacity-90 transition-opacity"
              style={{ background: "linear-gradient(135deg, #6366f1, #a855f7)" }}
            >
              {loading ? "Posting..." : "Post"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
