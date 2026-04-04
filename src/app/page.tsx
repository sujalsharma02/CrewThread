"use client";
import { useState, useEffect, useCallback } from "react";
import MainLayout from "@/components/layout/MainLayout";
import PostCard from "@/components/feed/PostCard";
import { Image, BarChart2, Smile, MapPin, Database, RefreshCw } from "lucide-react";

export default function FeedPage() {
  const [activeTab, setActiveTab] = useState<"foryou" | "following">("foryou");
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [seedMessage, setSeedMessage] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [composerText, setComposerText] = useState("");
  const [posting, setPosting] = useState(false);

  const fetchPosts = useCallback(async (pageNum = 1, reset = false) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/posts?page=${pageNum}&limit=10`);
      const data = await res.json();
      if (reset) setPosts(data.posts || []);
      else setPosts((prev) => [...prev, ...(data.posts || [])]);
      setHasMore(data.hasMore);
    } catch {}
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchPosts(1, true);
  }, [fetchPosts]);

  const handleSeed = async () => {
    setSeeding(true);
    setSeedMessage("");
    try {
      const res = await fetch("/api/seed", { method: "POST" });
      const data = await res.json();
      setSeedMessage(data.message || data.error);
      if (res.ok) setTimeout(() => { setSeedMessage(""); fetchPosts(1, true); }, 1500);
    } catch {
      setSeedMessage("Seeding failed");
    }
    setSeeding(false);
  };

  const handleQuickPost = async () => {
    if (!composerText.trim()) return;
    setPosting(true);
    try {
      const usersRes = await fetch("/api/users");
      const { users } = await usersRes.json();
      if (!users?.length) { alert("Seed demo data first!"); setPosting(false); return; }
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ authorId: users[0]._id, content: composerText, type: "normal" }),
      });
      const { post } = await res.json();
      if (post) { setPosts((prev) => [post, ...prev]); setComposerText(""); }
    } catch {}
    setPosting(false);
  };

  return (
    <MainLayout>
      {/* Header — sticky, glassmorphism exactly like X */}
      <div
        className="sticky top-0 z-30 flex flex-col"
        style={{ backgroundColor: "rgba(0,0,0,0.85)", backdropFilter: "blur(12px)", borderBottom: "1px solid #2f3336" }}
      >
        {/* Title row */}
        <div className="flex items-center justify-between px-4 py-3">
          <h1 className="text-xl font-bold" style={{ color: "#e7e9ea" }}>Home</h1>
          <div className="flex gap-2">
            <button
              onClick={handleSeed}
              disabled={seeding}
              title="Load demo data"
              className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-full transition-all disabled:opacity-50 hover:bg-white/10"
              style={{ color: "#71767b", border: "1px solid #2f3336" }}
            >
              <Database className="w-3 h-3" />
              {seeding ? "Loading..." : "Demo Data"}
            </button>
            <button onClick={() => { setPage(1); fetchPosts(1, true); }} className="p-2 rounded-full hover:bg-white/10 transition-colors" style={{ color: "#71767b" }}>
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* For You / Following tabs */}
        <div className="flex">
          {(["foryou", "following"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="flex-1 py-4 text-sm font-semibold transition-colors relative hover:bg-white/5"
              style={{ color: activeTab === tab ? "#e7e9ea" : "#71767b" }}
            >
              {tab === "foryou" ? "For you" : "Following"}
              {activeTab === tab && (
                <span
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 h-1 rounded-full"
                  style={{ width: 56, backgroundColor: "#6366f1" }}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {seedMessage && (
        <div className="px-4 py-2 text-sm" style={{ backgroundColor: "rgba(99,102,241,0.1)", color: "#818cf8", borderBottom: "1px solid #2f3336" }}>
          ✅ {seedMessage}
        </div>
      )}

      {/* Tweet Composer — always visible at top like X */}
      <div className="flex gap-3 px-4 py-3" style={{ borderBottom: "1px solid #2f3336" }}>
        <img
          src="https://api.dicebear.com/7.x/avataaars/svg?seed=sujal"
          alt="You"
          className="w-11 h-11 rounded-full flex-shrink-0"
          style={{ backgroundColor: "#1e2227" }}
        />
        <div className="flex-1">
          <textarea
            value={composerText}
            onChange={(e) => setComposerText(e.target.value)}
            placeholder="What's happening?"
            rows={composerText ? 3 : 1}
            className="w-full bg-transparent outline-none resize-none text-xl placeholder:text-zinc-600"
            style={{ color: "#e7e9ea" }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && e.metaKey) handleQuickPost();
            }}
          />
          {composerText && (
            <div className="flex items-center justify-between mt-3 pt-3" style={{ borderTop: "1px solid #2f3336" }}>
              <div className="flex gap-1" style={{ color: "#6366f1" }}>
                <button className="p-2 rounded-full hover:bg-indigo-500/10 transition-colors"><Image className="w-5 h-5" /></button>
                <button className="p-2 rounded-full hover:bg-indigo-500/10 transition-colors"><BarChart2 className="w-5 h-5" /></button>
                <button className="p-2 rounded-full hover:bg-indigo-500/10 transition-colors"><Smile className="w-5 h-5" /></button>
                <button className="p-2 rounded-full hover:bg-indigo-500/10 transition-colors"><MapPin className="w-5 h-5" /></button>
              </div>
              <button
                onClick={handleQuickPost}
                disabled={!composerText.trim() || posting}
                className="px-5 py-1.5 rounded-full font-bold text-sm text-white disabled:opacity-50 transition-opacity hover:opacity-90"
                style={{ background: "linear-gradient(135deg, #6366f1, #a855f7)" }}
              >
                {posting ? "Posting..." : "Post"}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Feed */}
      <div>
        {loading && posts.length === 0 ? (
          <TweetSkeleton />
        ) : posts.length === 0 ? (
          <EmptyFeed onSeed={handleSeed} seeding={seeding} />
        ) : (
          <>
            {posts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
            {hasMore && (
              <div className="py-6 flex justify-center">
                <button
                  onClick={() => { const next = page + 1; setPage(next); fetchPosts(next); }}
                  disabled={loading}
                  className="text-sm font-semibold px-4 py-2 rounded-full hover:bg-white/5 transition-colors"
                  style={{ color: "#6366f1" }}
                >
                  {loading ? "Loading..." : "Show more"}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </MainLayout>
  );
}

function TweetSkeleton() {
  return (
    <>
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="flex gap-3 px-4 py-3" style={{ borderBottom: "1px solid #2f3336" }}>
          <div className="w-11 h-11 rounded-full flex-shrink-0 skeleton" />
          <div className="flex-1 space-y-2 pt-1">
            <div className="flex gap-2">
              <div className="skeleton h-4 w-28 rounded-full" />
              <div className="skeleton h-4 w-20 rounded-full" />
            </div>
            <div className="skeleton h-4 w-full rounded-full" />
            <div className="skeleton h-4 w-4/5 rounded-full" />
            <div className="skeleton h-4 w-2/3 rounded-full" />
          </div>
        </div>
      ))}
    </>
  );
}

function EmptyFeed({ onSeed, seeding }: { onSeed: () => void; seeding: boolean }) {
  return (
    <div className="flex flex-col items-center py-20 px-8 text-center">
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5"
        style={{ background: "linear-gradient(135deg, #6366f1, #a855f7)" }}
      >
        <Database className="w-8 h-8 text-white" />
      </div>
      <h2 className="text-2xl font-bold mb-2" style={{ color: "#e7e9ea" }}>Welcome to TJP!</h2>
      <p className="text-base mb-6 max-w-sm" style={{ color: "#71767b" }}>
        Load demo data to explore the platform with realistic posts, job listings, and freelance projects.
      </p>
      <button
        onClick={onSeed}
        disabled={seeding}
        className="px-6 py-3 rounded-full font-bold text-base text-white disabled:opacity-50 hover:opacity-90 transition-opacity"
        style={{ background: "linear-gradient(135deg, #6366f1, #a855f7)" }}
      >
        {seeding ? "Loading Demo Data..." : "Load Demo Data"}
      </button>
    </div>
  );
}
