"use client";
import MainLayout from "@/components/layout/MainLayout";
import { Settings, User, Bell, Shield, Palette, HelpCircle, LogOut, ChevronRight } from "lucide-react";

const SECTIONS = [
  {
    title: "Account",
    items: [
      { icon: User,     label: "Edit Profile",               desc: "Update your name, bio, skills",       href: "/profile/sujalsharma", danger: false },
      { icon: Shield,   label: "Privacy & Safety",           desc: "Control who can see your content",    href: "#",                    danger: false },
      { icon: Bell,     label: "Notification Preferences",   desc: "Manage email and push notifications", href: "#",                    danger: false },
    ],
  },
  {
    title: "Appearance",
    items: [
      { icon: Palette,  label: "Theme",                      desc: "Dark mode (default)",                 href: "#",                    danger: false },
    ],
  },
  {
    title: "Support",
    items: [
      { icon: HelpCircle, label: "Help Center",              desc: "Find answers to common questions",    href: "#",                    danger: false },
      { icon: LogOut,     label: "Sign Out",                 desc: "Come back soon!",                     href: "#",                    danger: true  },
    ],
  },
];

export default function SettingsPage() {
  return (
    <MainLayout>
      {/* Header */}
      <div
        className="sticky top-0 z-30 px-4 py-3"
        style={{ backgroundColor: "rgba(0,0,0,0.85)", backdropFilter: "blur(12px)", borderBottom: "1px solid #2f3336" }}
      >
        <h1 className="text-xl font-bold" style={{ color: "#e7e9ea" }}>Settings</h1>
      </div>

      <div className="px-4 py-4 space-y-6">
        {SECTIONS.map(section => (
          <div key={section.title}>
            <p className="text-xs font-semibold uppercase tracking-widest mb-2 px-1" style={{ color: "#71767b" }}>
              {section.title}
            </p>
            <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: "#16181c", border: "1px solid #2f3336" }}>
              {section.items.map((item, idx) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="flex items-center gap-4 px-4 py-4 transition-colors"
                  style={{
                    borderTop: idx > 0 ? "1px solid #2f3336" : "none",
                    textDecoration: "none",
                    color: item.danger ? "#ef4444" : "#e7e9ea",
                  }}
                  onMouseEnter={e => (e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.03)")}
                  onMouseLeave={e => (e.currentTarget.style.backgroundColor = "transparent")}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: item.danger ? "rgba(239,68,68,0.1)" : "#202327" }}
                  >
                    <item.icon className="w-5 h-5" style={{ color: item.danger ? "#ef4444" : "#71767b" }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm" style={{ color: item.danger ? "#ef4444" : "#e7e9ea" }}>{item.label}</p>
                    <p className="text-xs mt-0.5" style={{ color: "#71767b" }}>{item.desc}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 flex-shrink-0" style={{ color: "#71767b" }} />
                </a>
              ))}
            </div>
          </div>
        ))}

        <p className="text-center text-xs py-4" style={{ color: "#71767b" }}>
          TheJoblessPeoples v1.0.0 · Made with 💜 by Sujal Sharma
        </p>
      </div>
    </MainLayout>
  );
}
