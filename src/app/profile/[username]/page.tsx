"use client";
import { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { useParams } from "next/navigation";
import { MapPin, ExternalLink, Edit3, UserPlus, Briefcase, Code2, CheckCircle, Calendar } from "lucide-react";

const AVAILABILITY = {
  open_to_work:  { label: "Open to Work",          dot: "#22c55e", bg: "rgba(34,197,94,0.1)",  border: "rgba(34,197,94,0.3)"  },
  freelance:     { label: "Available for Freelance", dot: "#a855f7", bg: "rgba(168,85,247,0.1)", border: "rgba(168,85,247,0.3)" },
  not_available: { label: "Not Available",           dot: "#71767b", bg: "transparent",          border: "transparent"          },
};

export default function ProfilePage() {
  const params  = useParams();
  const username = params.username as string;
  const [user,    setUser]    = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [tab,     setTab]     = useState("posts");
  const [editing, setEditing] = useState(false);
  const [form,    setForm]    = useState<any>({});

  useEffect(() => {
    (async () => {
      try {
        const res  = await fetch(`/api/users/${username}`);
        const data = await res.json();
        setUser(data.user);
        setForm(data.user || {});
      } catch {}
      setLoading(false);
    })();
  }, [username]);

  const handleSave = async () => {
    try {
      const res  = await fetch(`/api/users/${username}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      const data = await res.json();
      setUser(data.user);
      setEditing(false);
    } catch {}
  };

  if (loading) return <MainLayout><ProfileSkeleton /></MainLayout>;

  if (!user) return (
    <MainLayout>
      <div className="p-16 text-center" style={{ color: "#71767b" }}>
        <p className="text-xl font-bold mb-2" style={{ color: "#e7e9ea" }}>User not found</p>
        <p>Seed demo data first — go to Home and click "Demo Data"</p>
      </div>
    </MainLayout>
  );

  const avail = AVAILABILITY[user.availability as keyof typeof AVAILABILITY] || AVAILABILITY.not_available;
  const isMe  = username === "sujalsharma";
  const TABS  = ["posts", "skills", "experience", "education"];

  return (
    <MainLayout>
      {/* Cover */}
      <div className="h-48 relative overflow-hidden" style={{ background: "linear-gradient(135deg, #1a1a4e 0%, #0f0f3d 50%, #1a0a2e 100%)" }}>
        {user.coverPhoto && <img src={user.coverPhoto} alt="cover" className="w-full h-full object-cover" />}
      </div>

      {/* Header */}
      <div className="px-4 pb-0" style={{ borderBottom: "1px solid #2f3336" }}>
        <div className="flex items-end justify-between -mt-14 mb-3 relative z-10">
          <img
            src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`}
            alt={user.name}
            className="w-[110px] h-[110px] rounded-full object-cover"
            style={{ border: "4px solid #000", backgroundColor: "#1e2227" }}
          />
          {isMe ? (
            <button
              onClick={() => setEditing(!editing)}
              className="px-4 py-1.5 rounded-full font-bold text-sm transition-colors"
              style={{ border: "1px solid #536471", color: "#e7e9ea" }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#1e2227")}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = "transparent")}
            >
              {editing ? "Cancel" : "Edit profile"}
            </button>
          ) : (
            <button
              className="px-4 py-1.5 rounded-full font-bold text-sm text-black hover:bg-zinc-200 transition-colors"
              style={{ backgroundColor: "#e7e9ea" }}
            >
              Follow
            </button>
          )}
        </div>

        {editing ? (
          <EditForm form={form} setForm={setForm} onSave={handleSave} />
        ) : (
          <div className="mb-4">
            <div className="flex items-center gap-1.5 mb-0.5">
              <h1 className="text-xl font-black" style={{ color: "#e7e9ea" }}>{user.name}</h1>
              {user.role === "company" && <CheckCircle className="w-5 h-5" style={{ color: "#6366f1" }} />}
            </div>
            <p className="text-sm mb-3" style={{ color: "#71767b" }}>@{user.username}</p>

            {user.headline && <p className="text-[15px] mb-2" style={{ color: "#e7e9ea" }}>{user.headline}</p>}
            {user.bio       && <p className="text-[15px] leading-relaxed mb-3" style={{ color: "#e7e9ea" }}>{user.bio}</p>}

            <div className="flex flex-wrap gap-4 text-sm mb-3" style={{ color: "#71767b" }}>
              {user.location     && <span className="flex items-center gap-1"><MapPin className="w-4 h-4" />{user.location}</span>}
              {user.githubLink   && <a href={user.githubLink}   target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:underline" style={{ color: "#6366f1" }}>GitHub <ExternalLink className="w-3 h-3" /></a>}
              {user.linkedinLink && <a href={user.linkedinLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:underline" style={{ color: "#6366f1" }}>LinkedIn <ExternalLink className="w-3 h-3" /></a>}
              {user.createdAt    && <span className="flex items-center gap-1"><Calendar className="w-4 h-4" />Joined {new Date(user.createdAt).toLocaleDateString("en-IN", { month: "long", year: "numeric" })}</span>}
            </div>

            {user.availability !== "not_available" && (
              <div className="flex items-center gap-1.5 mb-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
                  style={{ backgroundColor: avail.bg, border: `1px solid ${avail.border}`, color: avail.dot }}>
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: avail.dot }} />
                  {avail.label}
                </span>
              </div>
            )}

            <div className="flex gap-5 text-sm" style={{ color: "#71767b" }}>
              <span><strong style={{ color: "#e7e9ea" }}>{user.following?.length || 0}</strong> Following</span>
              <span><strong style={{ color: "#e7e9ea" }}>{user.followers?.length || 0}</strong> Followers</span>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex">
          {TABS.map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className="flex-1 py-4 text-sm font-semibold capitalize relative transition-colors hover:bg-white/5"
              style={{ color: tab === t ? "#e7e9ea" : "#71767b" }}
            >
              {t}
              {tab === t && <span className="absolute bottom-0 left-1/2 -translate-x-1/2 h-1 rounded-full w-12" style={{ backgroundColor: "#6366f1" }} />}
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      <div className="p-4">
        {tab === "skills" && (
          <div>
            <h3 className="font-bold text-base mb-3" style={{ color: "#e7e9ea" }}>Skills</h3>
            <div className="flex flex-wrap gap-2">
              {user.skills?.length > 0 ? user.skills.map((s: string) => (
                <span key={s} className="px-3 py-1 rounded-full text-sm font-medium"
                  style={{ backgroundColor: "rgba(99,102,241,0.1)", color: "#818cf8", border: "1px solid rgba(99,102,241,0.2)" }}>{s}</span>
              )) : <p style={{ color: "#71767b" }}>No skills added yet.</p>}
            </div>
          </div>
        )}

        {tab === "experience" && (
          <div className="space-y-4">
            <h3 className="font-bold text-base" style={{ color: "#e7e9ea" }}>Experience</h3>
            {user.experience?.length > 0 ? user.experience.map((exp: any, i: number) => (
              <div key={i} className="flex gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "#16181c" }}>
                  <Briefcase className="w-5 h-5" style={{ color: "#6366f1" }} />
                </div>
                <div>
                  <p className="font-bold text-sm" style={{ color: "#e7e9ea" }}>{exp.role}</p>
                  <p className="text-sm" style={{ color: "#71767b" }}>{exp.company} · {exp.duration}</p>
                  {exp.description && <p className="text-sm mt-1" style={{ color: "#9394a5" }}>{exp.description}</p>}
                </div>
              </div>
            )) : <p style={{ color: "#71767b" }}>No experience added yet.</p>}
          </div>
        )}

        {tab === "education" && (
          <div className="space-y-4">
            <h3 className="font-bold text-base" style={{ color: "#e7e9ea" }}>Education</h3>
            {user.education?.length > 0 ? user.education.map((edu: any, i: number) => (
              <div key={i} className="flex gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "#16181c" }}>
                  <Code2 className="w-5 h-5" style={{ color: "#a855f7" }} />
                </div>
                <div>
                  <p className="font-bold text-sm" style={{ color: "#e7e9ea" }}>{edu.degree}</p>
                  <p className="text-sm" style={{ color: "#71767b" }}>{edu.institution} · {edu.year}</p>
                </div>
              </div>
            )) : <p style={{ color: "#71767b" }}>No education added yet.</p>}
          </div>
        )}

        {tab === "posts" && (
          <p className="py-8 text-center" style={{ color: "#71767b" }}>Posts will appear here.</p>
        )}
      </div>
    </MainLayout>
  );
}

import ImageCropperModal from "@/components/feed/ImageCropperModal";

function EditForm({ form, setForm, onSave }: { form: any; setForm: any; onSave: () => void }) {
  const [uploading, setUploading] = useState(false);
  const [cropConfig, setCropConfig] = useState<{ src: string; field: "avatar" | "coverPhoto"; aspect: number } | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, field: "avatar" | "coverPhoto") => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setCropConfig({ src: url, field, aspect: field === "avatar" ? 1 : 3 });
    e.target.value = ""; // Reset input so same file can be selected again
  };

  const handleCropSave = async (croppedBlob: Blob) => {
    if (!cropConfig) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", croppedBlob, "cropped.jpg");
      fd.append("folder", "thejobless_profiles");
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (data.url) setForm({ ...form, [cropConfig.field]: data.url });
    } catch (e) {
      console.error("Upload failed", e);
    }
    setUploading(false);
    setCropConfig(null);
  };

  return (
    <>
      {cropConfig && (
        <ImageCropperModal
          imageSrc={cropConfig.src}
          aspectRatio={cropConfig.aspect}
          onCancel={() => setCropConfig(null)}
          onCropSave={handleCropSave}
        />
      )}
      
      <div className="space-y-3 pb-4 animate-slide-up">
        {/* Render a visual preview before saving */}
        <div className="grid grid-cols-2 gap-3 mb-1 p-3 rounded-xl" style={{ backgroundColor: "#16181c", border: "1px solid #2f3336" }}>
          <div>
            <label className="text-xs font-bold block mb-1.5" style={{ color: "#e7e9ea" }}>Profile Picture (DP)</label>
            {form.avatar && <img src={form.avatar} alt="DP Preview" className="w-12 h-12 rounded-full object-cover mb-2 border border-zinc-700" />}
            <input type="file" accept="image/*" onChange={e => handleFileSelect(e, "avatar")} disabled={uploading} className="text-xs" style={{ color: "#71767b" }} />
          </div>
          <div>
            <label className="text-xs font-bold block mb-1.5" style={{ color: "#e7e9ea" }}>Cover Photo</label>
            {form.coverPhoto && <img src={form.coverPhoto} alt="Cover Preview" className="w-16 h-8 rounded-md object-cover mb-2 border border-zinc-700" />}
            <input type="file" accept="image/*" onChange={e => handleFileSelect(e, "coverPhoto")} disabled={uploading} className="text-xs" style={{ color: "#71767b" }} />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <input className="input-base" placeholder="Full Name" value={form.name || ""} onChange={e => setForm({ ...form, name: e.target.value })} />
          <input className="input-base" placeholder="Headline" value={form.headline || ""} onChange={e => setForm({ ...form, headline: e.target.value })} />
        </div>
        <textarea className="textarea-base min-h-[80px]" placeholder="Bio" value={form.bio || ""} onChange={e => setForm({ ...form, bio: e.target.value })} />
        <input className="input-base" placeholder="Location" value={form.location || ""} onChange={e => setForm({ ...form, location: e.target.value })} />
        <input className="input-base" placeholder="Skills (comma separated)" value={form.skills?.join(", ") || ""} onChange={e => setForm({ ...form, skills: e.target.value.split(",").map((s: string) => s.trim()) })} />
        <input className="input-base" placeholder="GitHub URL" value={form.githubLink || ""} onChange={e => setForm({ ...form, githubLink: e.target.value })} />
        <input className="input-base" placeholder="LinkedIn URL" value={form.linkedinLink || ""} onChange={e => setForm({ ...form, linkedinLink: e.target.value })} />
        <select className="input-base" value={form.availability || "not_available"} onChange={e => setForm({ ...form, availability: e.target.value })}>
          <option value="open_to_work">Open to Work</option>
          <option value="freelance">Available for Freelance</option>
          <option value="not_available">Not Available</option>
        </select>
        <button onClick={onSave} disabled={uploading} className="w-full py-3 rounded-full font-bold text-white hover:opacity-90 disabled:opacity-50 transition-opacity"
          style={{ background: "linear-gradient(135deg, #6366f1, #a855f7)" }}>
          {uploading ? "Uploading Image..." : "Save changes"}
        </button>
      </div>
    </>
  );
}

function ProfileSkeleton() {
  return (
    <div>
      <div className="skeleton h-48 w-full" style={{ borderRadius: 0 }} />
      <div className="px-4 py-4 space-y-3">
        <div className="skeleton w-28 h-28 rounded-full" style={{ marginTop: -56 }} />
        <div className="skeleton h-6 w-48 rounded-full" />
        <div className="skeleton h-4 w-32 rounded-full" />
        <div className="skeleton h-4 w-full rounded-full" />
        <div className="skeleton h-4 w-3/4 rounded-full" />
      </div>
    </div>
  );
}
