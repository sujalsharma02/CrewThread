"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Home,
  Search,
  Bell,
  Mail,
  Briefcase,
  Code2,
  User,
  Settings,
  Zap,
  Feather,
  Sparkles,
  LogOut,
} from "lucide-react";
import { useState } from "react";
import CreatePostModal from "@/components/feed/CreatePostModal";
import { useAuth } from "@/components/auth/AuthProvider";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [showPost, setShowPost] = useState(false);
  const { user, logout } = useAuth();

  const profileHref = user ? `/profile/${user.username}` : "/login";
  const myAvatar =
    user?.avatar ||
    `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username || "guest"}`;

  const navItems = [
    { href: "/",            icon: Home,     label: "Home"         },
    { href: "/explore",     icon: Search,   label: "Explore"      },
    { href: "/notifications", icon: Bell,   label: "Notifications", badge: 3 },
    { href: "/messages",    icon: Mail,     label: "Messages"     },
    { href: "/grok",        icon: Sparkles, label: "Grok"         },
    { href: "/jobs",        icon: Briefcase,label: "Jobs"         },
    { href: "/projects",    icon: Code2,    label: "Projects"     },
    { href: profileHref,    icon: User,     label: "Profile"      },
    { href: "/settings",    icon: Settings, label: "More"         },
  ];

  const handleLogout = async () => {
    await logout();
    router.push("/login");
    router.refresh();
  };

  return (
    <div
      className="flex min-h-screen justify-center"
      style={{ backgroundColor: "#000", color: "#e7e9ea" }}
    >
      {/* ── Left Sidebar ── */}
      <div
        className="hidden sm:flex flex-col"
        style={{
          width: 68,
          flexShrink: 0,
        }}
      >
        {/* Make it sticky inside a full-height wrapper */}
        <div
          className="flex flex-col h-screen py-2 px-2 sticky top-0"
          style={{ width: 68 }}
        >
          {/* Logo */}
          <Link href="/" className="flex flex-col items-center justify-center w-[56px] h-[56px] rounded-full hover:bg-white/10 transition-colors mb-2 mx-auto font-black leading-none select-none tracking-tight">
            <div className="text-[15px]" style={{ color: "#fff" }}>Crew</div>
            <div className="text-[13px]" style={{ background: "linear-gradient(135deg, #6366f1, #a855f7)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Thread</div>
          </Link>

          {/* Nav */}
          <nav className="flex flex-col gap-1 flex-1">
            {navItems.map(({ href, icon: Icon, label, badge }) => {
              const active = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  title={label}
                  className="flex items-center justify-center w-12 h-12 rounded-full mx-auto transition-colors relative"
                  style={{
                    color: active ? "#6366f1" : "#e7e9ea",
                    backgroundColor: "transparent",
                  }}
                  onMouseEnter={e => { if (!active) (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(255,255,255,0.1)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = "transparent"; }}
                >
                  <Icon style={{ width: 26, height: 26, strokeWidth: active ? 2.5 : 1.75 }} />
                  {badge && (
                    <span className="absolute top-1 right-1 w-4 h-4 text-white text-[10px] rounded-full flex items-center justify-center font-bold"
                      style={{ backgroundColor: "#6366f1", fontSize: 10 }}>
                      {badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Post button (icon on narrow sidebar) */}
          <button
            onClick={() => setShowPost(true)}
            className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 text-white hover:opacity-90 transition-opacity"
            style={{ background: "linear-gradient(135deg,#6366f1,#a855f7)" }}
            title="Post"
          >
            <Feather className="w-5 h-5" />
          </button>

          {/* Avatar / Auth */}
          {user ? (
            <>
              <Link href={profileHref} title={`@${user.username}`} className="flex items-center justify-center w-12 h-12 rounded-full mx-auto hover:bg-white/10 transition-colors">
                <img src={myAvatar} alt={user.name} className="w-9 h-9 rounded-full" style={{ backgroundColor: "#1e2227" }} />
              </Link>
              <button
                onClick={handleLogout}
                title="Log out"
                className="flex items-center justify-center w-12 h-12 rounded-full mx-auto mb-2 transition-colors"
                style={{ color: "#71767b" }}
                onMouseEnter={e => ((e.currentTarget as HTMLElement).style.backgroundColor = "rgba(255,255,255,0.1)")}
                onMouseLeave={e => ((e.currentTarget as HTMLElement).style.backgroundColor = "transparent")}
              >
                <LogOut className="w-5 h-5" />
              </button>
            </>
          ) : (
            <Link
              href="/login"
              title="Log in"
              className="flex items-center justify-center w-12 h-12 rounded-full mx-auto mb-2 text-white transition-opacity hover:opacity-90"
              style={{ background: "linear-gradient(135deg,#6366f1,#a855f7)" }}
            >
              <User className="w-5 h-5" />
            </Link>
          )}
        </div>
      </div>

      {/* ── Center Feed ── */}
      <main
        className="flex-1 flex flex-col min-h-screen"
        style={{
          maxWidth: 600,
          borderLeft:  "1px solid #2f3336",
          borderRight: "1px solid #2f3336",
        }}
      >
        {children}
      </main>

      {/* ── Right Sidebar ── */}
      <div className="hidden lg:block" style={{ width: 340, flexShrink: 0 }}>
        <div className="sticky top-0 h-screen overflow-y-auto py-3 px-4">
          <RightSidebar />
        </div>
      </div>

      {showPost && (
        <CreatePostModal onClose={() => setShowPost(false)} />
      )}
    </div>
  );
}

function RightSidebar() {
  return (
    <div className="flex flex-col gap-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "#71767b" }} />
        <input
          type="text"
          placeholder="Search"
          className="w-full rounded-full py-3 pl-12 pr-4 text-sm outline-none"
          style={{ backgroundColor: "#202327", color: "#e7e9ea", border: "none" }}
        />
      </div>

      {/* Trending */}
      <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: "#16181c" }}>
        <h2 className="px-4 pt-4 pb-1 text-xl font-bold" style={{ color: "#e7e9ea" }}>Trends for you</h2>
        {[
          { tag: "#OpenToWork",  posts: "12.4K" },
          { tag: "#ReactJobs",   posts: "8.1K"  },
          { tag: "#MERNStack",   posts: "5.6K"  },
          { tag: "#Freelance",   posts: "4.2K"  },
          { tag: "#Hiring2026",  posts: "3.8K"  },
        ].map(t => (
          <div key={t.tag} className="px-4 py-3 cursor-pointer transition-colors" style={{ borderTop: "1px solid #2f3336" }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.03)")}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = "transparent")}
          >
            <p className="text-xs" style={{ color: "#71767b" }}>Trending in Tech</p>
            <p className="font-bold text-sm" style={{ color: "#e7e9ea" }}>{t.tag}</p>
            <p className="text-xs" style={{ color: "#71767b" }}>{t.posts} posts</p>
          </div>
        ))}
        <div className="px-4 py-3">
          <span className="text-sm cursor-pointer hover:underline" style={{ color: "#6366f1" }}>Show more</span>
        </div>
      </div>

      {/* Who to follow */}
      <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: "#16181c" }}>
        <h2 className="px-4 pt-4 pb-1 text-xl font-bold" style={{ color: "#e7e9ea" }}>Who to follow</h2>
        {[
          { name: "TechCorp India", username: "techcorpindia", seed: "techcorp"   },
          { name: "Priya Mehta",    username: "priyamehta",    seed: "priya"      },
          { name: "StartupHub",     username: "startuphub",    seed: "startuphub" },
        ].map(u => (
          <div key={u.username} className="px-4 py-3 flex items-center gap-3 transition-colors" style={{ borderTop: "1px solid #2f3336" }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.03)")}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = "transparent")}
          >
            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${u.seed}`} alt={u.name}
              className="w-10 h-10 rounded-full flex-shrink-0" style={{ backgroundColor: "#1e2227" }} />
            <div className="flex-1 min-w-0">
              <p className="font-bold text-sm truncate" style={{ color: "#e7e9ea" }}>{u.name}</p>
              <p className="text-sm truncate" style={{ color: "#71767b" }}>@{u.username}</p>
            </div>
            <button className="px-4 py-1.5 rounded-full font-bold text-sm text-black bg-white hover:bg-zinc-200 transition-colors flex-shrink-0">
              Follow
            </button>
          </div>
        ))}
        <div className="px-4 py-3" style={{ borderTop: "1px solid #2f3336" }}>
          <span className="text-sm cursor-pointer hover:underline" style={{ color: "#6366f1" }}>Show more</span>
        </div>
      </div>

      <p className="text-xs px-1" style={{ color: "#71767b" }}>© 2026 TheJoblessPeoples · Sujal Sharma</p>
    </div>
  );
}


