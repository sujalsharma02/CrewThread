"use client";
import { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Search as SearchIcon, Briefcase, Code2, User, TrendingUp } from "lucide-react";

export default function ExplorePage() {
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"people" | "companies">("people");

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/users?q=${encodeURIComponent(query)}&role=${activeTab === "companies" ? "company" : "jobseeker"}`);
      const data = await res.json();
      setUsers(data.users || []);
    } catch {}
    setLoading(false);
  };

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const role = activeTab === "companies" ? "company" : "jobseeker";
        const res = await fetch(`/api/users?role=${role}`);
        const data = await res.json();
        setUsers(data.users || []);
      } catch {}
      setLoading(false);
    };
    fetchAll();
  }, [activeTab]);

  return (
    <MainLayout>
      <div className="sticky top-0 z-30 glass border-b border-border px-4 py-3">
        <h1 className="font-bold text-text-primary text-lg flex items-center gap-2 mb-3">
          <TrendingUp className="w-5 h-5 text-primary" />
          Explore
        </h1>

        <div className="relative mb-3">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="Search people, skills, companies..."
            className="input-base pl-10"
          />
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab("people")}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
              activeTab === "people" ? "bg-primary text-white" : "bg-surface-2 text-text-secondary border border-border"
            }`}
          >
            <User className="w-4 h-4" />
            People
          </button>
          <button
            onClick={() => setActiveTab("companies")}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
              activeTab === "companies" ? "bg-primary text-white" : "bg-surface-2 text-text-secondary border border-border"
            }`}
          >
            <Briefcase className="w-4 h-4" />
            Companies
          </button>
        </div>
      </div>

      <div className="divide-y divide-border">
        {loading ? (
          <ExploreSkeleton />
        ) : users.length === 0 ? (
          <div className="p-12 text-center text-text-muted">
            <SearchIcon className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>No results. Seed demo data from the home page!</p>
          </div>
        ) : (
          users.map((user) => <UserCard key={user._id} user={user} />)
        )}
      </div>
    </MainLayout>
  );
}

function UserCard({ user }: { user: any }) {
  const [following, setFollowing] = useState(false);
  const availColor = user.availability === "open_to_work" ? "text-success" : user.availability === "freelance" ? "text-accent" : "";

  return (
    <div className="p-4 hover:bg-surface/50 transition-colors">
      <div className="flex items-center gap-3">
        <a href={`/profile/${user.username}`}>
          <img
            src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`}
            alt={user.name}
            className="w-12 h-12 rounded-full bg-surface-3 hover:opacity-90 transition-opacity"
          />
        </a>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <a href={`/profile/${user.username}`} className="font-bold text-text-primary hover:underline text-sm">
              {user.name}
            </a>
            {user.availability !== "not_available" && (
              <span className={`text-xs font-medium ${availColor}`}>
                {user.availability === "open_to_work" ? "• Open to Work" : "• Freelance"}
              </span>
            )}
          </div>
          <p className="text-text-muted text-xs">@{user.username}</p>
          {user.headline && <p className="text-text-secondary text-sm mt-0.5 truncate">{user.headline}</p>}
          {user.skills && user.skills.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1">
              {user.skills.slice(0, 4).map((skill: string) => (
                <span key={skill} className="badge bg-surface-3 text-text-secondary text-xs">
                  {skill}
                </span>
              ))}
            </div>
          )}
        </div>
        <button
          onClick={() => setFollowing(!following)}
          className={following ? "btn-secondary text-xs px-3 py-1" : "btn-primary text-xs px-3 py-1"}
        >
          {following ? "Following" : "Follow"}
        </button>
      </div>
    </div>
  );
}

function ExploreSkeleton() {
  return (
    <>
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="p-4 flex gap-3">
          <div className="skeleton w-12 h-12 rounded-full shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="skeleton h-4 w-40 rounded" />
            <div className="skeleton h-3 w-28 rounded" />
          </div>
        </div>
      ))}
    </>
  );
}
