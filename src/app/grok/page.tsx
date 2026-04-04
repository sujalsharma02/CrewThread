"use client";
import { useState, useRef, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Send, Bot, Sparkles, AlertCircle } from "lucide-react";

type Message = { role: "user" | "assistant"; content: string };

export default function GrokPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of chat
  useEffect(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), [messages]);

  const send = async () => {
    if (!input.trim() || loading) return;

    const newMsg: Message = { role: "user", content: input };
    const chatHistory = [...messages, newMsg];
    
    setMessages(chatHistory);
    setInput("");
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: chatHistory }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to get response");

      setMessages([...chatHistory, { role: "assistant", content: data.text }]);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred");
      // Remove latest user message if failed
      setMessages(chatHistory.slice(0, -1));
      setInput(newMsg.content);
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="flex flex-col h-screen max-w-[600px] w-full">
        {/* Header */}
        <div
          className="sticky top-0 z-30 px-4 py-3 flex flex-col justify-center flex-shrink-0"
          style={{ backgroundColor: "rgba(0,0,0,0.85)", backdropFilter: "blur(12px)", borderBottom: "1px solid #2f3336" }}
        >
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-zinc-100" />
            <h1 className="text-xl font-bold" style={{ color: "#e7e9ea" }}>Grok</h1>
          </div>
          <p className="text-xs text-zinc-500">Powered by Gemini AI</p>
        </div>

        {/* Chat area */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center px-8" style={{ color: "#71767b" }}>
              <Bot className="w-16 h-16 mb-4 opacity-20" />
              <h2 className="text-xl font-bold mb-2" style={{ color: "#e7e9ea" }}>Ask Grok anything</h2>
              <p className="text-sm">Get real-time insights, write code, or just have a chat. Grok is here to help.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-8 w-full">
                {[
                  "Write a React hook for window size",
                  "What's trending in tech today?",
                  "Give me tips for my dev portfolio",
                  "Tell me a joke about programming"
                ].map((suggestion, i) => (
                  <button 
                    key={i}
                    onClick={() => setInput(suggestion)}
                    className="p-3 rounded-2xl text-sm border text-left hover:bg-zinc-900 transition-colors"
                    style={{ borderColor: "#2f3336", color: "#e7e9ea" }}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className="max-w-[85%] px-4 py-3 rounded-2xl text-[15px] leading-relaxed whitespace-pre-wrap"
                  style={
                    m.role === "user"
                      ? { backgroundColor: "#fff", color: "#000", borderBottomRightRadius: 4 }
                      : { backgroundColor: "transparent", color: "#e7e9ea" } // AI response doesn't need a bubble background, just raw text in X style usually
                  }
                >
                  {m.role === "assistant" && (
                    <div className="flex items-center gap-2 mb-1.5 opacity-80">
                      <Sparkles className="w-4 h-4" />
                      <span className="text-xs font-bold uppercase tracking-wider">Grok</span>
                    </div>
                  )}
                  {(m as any).text || m.content}
                </div>
              </div>
            ))
          )}
          {loading && (
            <div className="flex justify-start">
              <div className="px-4 py-3 text-[15px]" style={{ color: "#71767b" }}>
                <div className="flex gap-1">
                  <span className="w-1.5 h-1.5 bg-zinc-600 rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-zinc-600 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></span>
                  <span className="w-1.5 h-1.5 bg-zinc-600 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></span>
                </div>
              </div>
            </div>
          )}
          {error && (
            <div className="flex justify-center my-4">
              <div className="bg-red-500/10 text-red-500 text-sm px-4 py-2 rounded-xl flex items-center gap-2 border border-red-500/20">
                <AlertCircle className="w-4 h-4" /> {error}
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="p-3 flex-shrink-0" style={{ borderTop: "1px solid #2f3336" }}>
          <div 
            className="flex items-end gap-2 p-2 rounded-3xl"
            style={{ backgroundColor: "#202327", border: "1px solid transparent" }}
            onFocus={(e) => e.currentTarget.style.borderColor = "#6366f1"}
            onBlur={(e) => e.currentTarget.style.borderColor = "transparent"}
          >
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send();
                }
              }}
              placeholder="Ask Grok..."
              className="flex-1 bg-transparent border-none outline-none resize-none px-3 py-1.5 text-base max-h-32"
              style={{ color: "#e7e9ea", minHeight: 36 }}
              rows={input.split('\n').length > 1 ? Math.min(input.split('\n').length, 5) : 1}
            />
            <button
              onClick={send}
              disabled={!input.trim() || loading}
              className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 disabled:opacity-40 transition-colors mb-0.5 mr-0.5"
              style={{ backgroundColor: input.trim() && !loading ? "#fff" : "transparent", color: input.trim() && !loading ? "#000" : "#71767b" }}
            >
              <Send className="w-4 h-4 ml-0.5" />
            </button>
          </div>
          <p className="text-center text-xs mt-2" style={{ color: "#71767b" }}>Grok can make mistakes. Verify important info.</p>
        </div>
      </div>
    </MainLayout>
  );
}
