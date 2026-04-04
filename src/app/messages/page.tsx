"use client";
import MainLayout from "@/components/layout/MainLayout";
import { Send } from "lucide-react";
import { useState } from "react";

const CONVOS = [
  { id: 1, name: "TechCorp India", username: "techcorpindia", seed: "techcorp",   last: "Let's schedule a call!",            time: "2m",  unread: 2 },
  { id: 2, name: "Priya Mehta",    username: "priyamehta",    seed: "priya",      last: "Would love to collaborate!",        time: "1h",  unread: 0 },
  { id: 3, name: "StartupHub",     username: "startuphub",    seed: "startuphub", last: "Can you start next week?",          time: "3h",  unread: 1 },
];

const INIT_MSGS: Record<number, { text: string; me: boolean; time: string }[]> = {
  1: [
    { text: "Hello! We came across your profile and were impressed!", me: false, time: "Yesterday 10:00" },
    { text: "Thank you! I'd love to know more about the role.",       me: true,  time: "Yesterday 10:15" },
    { text: "Let's schedule a call!",                                 me: false, time: "2m ago"          },
  ],
  2: [
    { text: "Hey! I saw your post. Would love to collaborate!", me: false, time: "1h ago" },
  ],
  3: [
    { text: "Hi, I submitted a proposal for your dashboard project.", me: true,  time: "5h ago" },
    { text: "Can you start next week?",                               me: false, time: "3h ago" },
  ],
};

export default function MessagesPage() {
  const [selected, setSelected] = useState<number>(1);
  const [msgs, setMsgs] = useState(INIT_MSGS);
  const [newMsg, setNewMsg] = useState("");

  const send = () => {
    if (!newMsg.trim()) return;
    setMsgs(m => ({ ...m, [selected]: [...(m[selected] || []), { text: newMsg, me: true, time: "Just now" }] }));
    setNewMsg("");
  };

  const convo = CONVOS.find(c => c.id === selected)!;

  return (
    <MainLayout>
      <div className="flex" style={{ height: "calc(100vh - 0px)" }}>
        {/* Conversation list */}
        <div className="flex flex-col flex-shrink-0" style={{ width: 220, borderRight: "1px solid #2f3336" }}>
          <div className="px-4 py-3" style={{ borderBottom: "1px solid #2f3336" }}>
            <h1 className="text-xl font-bold" style={{ color: "#e7e9ea" }}>Messages</h1>
          </div>
          <div className="flex-1 overflow-y-auto">
            {CONVOS.map(c => (
              <button
                key={c.id}
                onClick={() => setSelected(c.id)}
                className="w-full flex items-center gap-3 px-4 py-3 text-left transition-colors"
                style={{
                  borderBottom: "1px solid #2f3336",
                  backgroundColor: selected === c.id ? "rgba(99,102,241,0.08)" : "transparent",
                  borderLeft: selected === c.id ? "2px solid #6366f1" : "2px solid transparent",
                }}
                onMouseEnter={e => { if (selected !== c.id) (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(255,255,255,0.03)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = selected === c.id ? "rgba(99,102,241,0.08)" : "transparent"; }}
              >
                <div className="relative flex-shrink-0">
                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${c.seed}`} alt={c.name}
                    className="w-10 h-10 rounded-full" style={{ backgroundColor: "#1e2227" }} />
                  {c.unread > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 text-white text-[10px] rounded-full flex items-center justify-center font-bold"
                      style={{ backgroundColor: "#6366f1" }}>{c.unread}</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate" style={{ color: "#e7e9ea" }}>{c.name}</p>
                  <p className="text-xs truncate" style={{ color: "#71767b" }}>{c.last}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Chat area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3 flex-shrink-0" style={{ borderBottom: "1px solid #2f3336" }}>
            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${convo.seed}`} alt={convo.name}
              className="w-9 h-9 rounded-full flex-shrink-0" style={{ backgroundColor: "#1e2227" }} />
            <div>
              <p className="font-bold text-sm" style={{ color: "#e7e9ea" }}>{convo.name}</p>
              <p className="text-xs" style={{ color: "#22c55e" }}>Online</p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
            {(msgs[selected] || []).map((m, i) => (
              <div key={i} className={`flex ${m.me ? "justify-end" : "justify-start"}`}>
                <div
                  className="max-w-[75%] px-4 py-2.5 rounded-2xl text-sm"
                  style={
                    m.me
                      ? { background: "linear-gradient(135deg,#6366f1,#a855f7)", color: "#fff", borderBottomRightRadius: 4 }
                      : { backgroundColor: "#16181c", color: "#e7e9ea", border: "1px solid #2f3336", borderBottomLeftRadius: 4 }
                  }
                >
                  <p>{m.text}</p>
                  <p className="text-xs mt-1" style={{ color: m.me ? "rgba(255,255,255,0.6)" : "#71767b" }}>{m.time}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="flex items-center gap-3 px-4 py-3 flex-shrink-0" style={{ borderTop: "1px solid #2f3336" }}>
            <input
              type="text"
              value={newMsg}
              onChange={e => setNewMsg(e.target.value)}
              onKeyDown={e => e.key === "Enter" && send()}
              placeholder="Start a message"
              className="flex-1 rounded-full px-4 py-2.5 text-sm outline-none"
              style={{ backgroundColor: "#202327", color: "#e7e9ea", border: "none" }}
            />
            <button
              onClick={send}
              disabled={!newMsg.trim()}
              className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-white disabled:opacity-40 transition-opacity"
              style={{ background: "linear-gradient(135deg,#6366f1,#a855f7)" }}
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
