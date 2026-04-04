"use client";
import MainLayout from "@/components/layout/MainLayout";
import { Bell, Heart, UserPlus, Briefcase, MessageCircle, Repeat2 } from "lucide-react";

const DEMO = [
  { id: 1, icon: Heart,         iconColor: "#f91880", bg: "rgba(249,24,128,0.1)",  text: "TechCorp India liked your post",                     time: "2m",  unread: true  },
  { id: 2, icon: UserPlus,      iconColor: "#6366f1", bg: "rgba(99,102,241,0.1)",  text: "Priya Mehta started following you",                  time: "15m", unread: true  },
  { id: 3, icon: Briefcase,     iconColor: "#22c55e", bg: "rgba(34,197,94,0.1)",   text: "Your application at TechCorp India is under review",  time: "1h",  unread: true  },
  { id: 4, icon: MessageCircle, iconColor: "#1d9bf0", bg: "rgba(29,155,240,0.1)",  text: "StartupHub replied to your proposal",                time: "3h",  unread: false },
  { id: 5, icon: Heart,         iconColor: "#f91880", bg: "rgba(249,24,128,0.1)",  text: "Rahul Gupta liked your post",                        time: "5h",  unread: false },
  { id: 6, icon: Repeat2,       iconColor: "#00ba7c", bg: "rgba(0,186,124,0.1)",   text: "StartupHub reposted your post",                      time: "1d",  unread: false },
  { id: 7, icon: Briefcase,     iconColor: "#f59e0b", bg: "rgba(245,158,11,0.1)",  text: "New job match: Backend Developer at StartupHub",     time: "2d",  unread: false },
];

export default function NotificationsPage() {
  return (
    <MainLayout>
      {/* Header */}
      <div
        className="sticky top-0 z-30 px-4 py-3 flex items-center justify-between"
        style={{ backgroundColor: "rgba(0,0,0,0.85)", backdropFilter: "blur(12px)", borderBottom: "1px solid #2f3336" }}
      >
        <h1 className="text-xl font-bold" style={{ color: "#e7e9ea" }}>Notifications</h1>
        <button className="text-sm hover:underline" style={{ color: "#6366f1" }}>Mark all read</button>
      </div>

      {/* List */}
      <div>
        {DEMO.map(n => (
          <div
            key={n.id}
            className="flex items-start gap-4 px-4 py-3 cursor-pointer transition-colors"
            style={{
              borderBottom: "1px solid #2f3336",
              backgroundColor: n.unread ? "rgba(99,102,241,0.03)" : "transparent",
            }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.03)")}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = n.unread ? "rgba(99,102,241,0.03)" : "transparent")}
          >
            <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ backgroundColor: n.bg }}>
              <n.icon className="w-5 h-5" style={{ color: n.iconColor }} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm leading-relaxed" style={{ color: "#e7e9ea" }}>{n.text}</p>
              <p className="text-xs mt-0.5" style={{ color: "#71767b" }}>{n.time} ago</p>
            </div>
            {n.unread && <span className="w-2 h-2 rounded-full mt-2 flex-shrink-0" style={{ backgroundColor: "#6366f1" }} />}
          </div>
        ))}
      </div>
    </MainLayout>
  );
}
