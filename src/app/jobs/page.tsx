"use client";
import { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Briefcase, MapPin, Clock, DollarSign, Users, Search, Plus, X, ChevronDown } from "lucide-react";
import { formatDate } from "@/lib/utils";

const JOB_TYPES = ["all", "full-time", "part-time", "internship", "remote", "hybrid"];

const JOB_TYPE_COLORS: Record<string, { bg: string; text: string }> = {
  "full-time": { bg: "#6366f120", text: "#818cf8" },
  "part-time": { bg: "#a855f720", text: "#c084fc" },
  internship: { bg: "#f59e0b20", text: "#fbbf24" },
  remote: { bg: "#22c55e20", text: "#4ade80" },
  hybrid: { bg: "#3b82f620", text: "#60a5fa" },
};

export default function JobsPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [showCreateForm, setShowCreateForm] = useState(false);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set("skill", search);
      if (selectedType !== "all") params.set("type", selectedType);
      const res = await fetch(`/api/jobs?${params}`);
      const data = await res.json();
      setJobs(data.jobs || []);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { fetchJobs(); }, [selectedType]);

  return (
    <MainLayout>
      {/* Header */}
      <div
        className="sticky top-0 z-30 px-4 py-3"
        style={{ backgroundColor: "rgba(0,0,0,0.85)", backdropFilter: "blur(12px)", borderBottom: "1px solid #2f3336" }}
      >
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-xl font-bold" style={{ color: "#e7e9ea" }}>Jobs</h1>
          <button
            onClick={() => setShowCreateForm(true)}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-full font-bold text-sm text-white hover:opacity-90 transition-opacity"
            style={{ background: "linear-gradient(135deg, #6366f1, #a855f7)" }}
          >
            <Plus className="w-4 h-4" />
            Post a Job
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-3">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "#71767b" }} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && fetchJobs()}
            placeholder="Search by skill (React, Node.js...)"
            className="w-full rounded-full py-2.5 pl-11 pr-4 text-sm outline-none"
            style={{ backgroundColor: "#202327", color: "#e7e9ea", border: "1px solid #2f3336" }}
          />
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
          {JOB_TYPES.map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className="flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-semibold transition-all capitalize"
              style={
                selectedType === type
                  ? { backgroundColor: "#6366f1", color: "#fff" }
                  : { backgroundColor: "#202327", color: "#71767b", border: "1px solid #2f3336" }
              }
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Jobs list */}
      <div>
        {loading ? (
          <JobsSkeleton />
        ) : jobs.length === 0 ? (
          <EmptyState />
        ) : (
          jobs.map((job) => <JobCard key={job._id} job={job} />)
        )}
      </div>

      {showCreateForm && <CreateJobModal onClose={() => setShowCreateForm(false)} onCreated={fetchJobs} />}
    </MainLayout>
  );
}

function JobCard({ job }: { job: any }) {
  const company = job.companyId;
  const Colors = JOB_TYPE_COLORS[job.jobType] || { bg: "#20232720", text: "#71767b" };
  const daysLeft = job.lastDate
    ? Math.ceil((new Date(job.lastDate).getTime() - Date.now()) / 86400000)
    : null;
  const [applied, setApplied] = useState(false);
  const [applying, setApplying] = useState(false);

  const handleApply = async () => {
    setApplying(true);
    try {
      await fetch(`/api/jobs/${job._id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: "demo-user-id", coverLetter: "I am very interested in this position." }),
      });
      setApplied(true);
    } catch {}
    setApplying(false);
  };

  return (
    <div
      className="px-4 py-4 hover:bg-white/[0.02] transition-colors cursor-pointer"
      style={{ borderBottom: "1px solid #2f3336" }}
    >
      <div className="flex gap-3">
        <img
          src={company?.avatar || `https://api.dicebear.com/7.x/identicon/svg?seed=${company?.username}`}
          alt={company?.name}
          className="w-12 h-12 rounded-xl flex-shrink-0"
          style={{ backgroundColor: "#1e2227" }}
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <div>
              <h3 className="font-bold text-[15px]" style={{ color: "#e7e9ea" }}>{job.title}</h3>
              <p className="text-sm" style={{ color: "#71767b" }}>{company?.name}</p>
            </div>
            <span
              className="text-xs font-semibold px-2.5 py-1 rounded-full flex-shrink-0 capitalize"
              style={{ backgroundColor: Colors.bg, color: Colors.text }}
            >
              {job.jobType}
            </span>
          </div>

          <div className="flex flex-wrap gap-3 mt-2 text-xs" style={{ color: "#71767b" }}>
            <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{job.location}</span>
            <span className="flex items-center gap-1"><DollarSign className="w-3.5 h-3.5" />₹{job.salary?.min}–{job.salary?.max} {job.salary?.currency}</span>
            <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{job.experienceMin}–{job.experienceMax} yrs</span>
            <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" />{job.openings} opening{job.openings > 1 ? "s" : ""}</span>
          </div>

          <div className="flex flex-wrap gap-1.5 mt-2">
            {job.skills?.slice(0, 5).map((s: string) => (
              <span key={s} className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: "#1e2227", color: "#9394a5", border: "1px solid #2f3336" }}>
                {s}
              </span>
            ))}
          </div>

          <div className="flex items-center justify-between mt-3">
            {daysLeft !== null && (
              <span className="text-xs" style={{ color: daysLeft <= 7 ? "#ef4444" : "#71767b" }}>
                {daysLeft > 0 ? `${daysLeft}d left` : "Expired"}
              </span>
            )}
            <button
              onClick={handleApply}
              disabled={applied || applying}
              className="ml-auto px-5 py-1.5 rounded-full text-sm font-bold transition-all"
              style={
                applied
                  ? { backgroundColor: "#22c55e20", color: "#4ade80", border: "1px solid #22c55e40" }
                  : { backgroundColor: "#e7e9ea", color: "#000" }
              }
            >
              {applying ? "..." : applied ? "✓ Applied" : "Apply now"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function JobsSkeleton() {
  return (
    <>
      {[1, 2, 3].map((i) => (
        <div key={i} className="px-4 py-4 flex gap-3" style={{ borderBottom: "1px solid #2f3336" }}>
          <div className="skeleton w-12 h-12 rounded-xl flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="skeleton h-4 w-48 rounded-full" />
            <div className="skeleton h-3 w-32 rounded-full" />
            <div className="skeleton h-3 w-full rounded-full" />
          </div>
        </div>
      ))}
    </>
  );
}

function EmptyState() {
  return (
    <div className="py-16 text-center">
      <Briefcase className="w-12 h-12 mx-auto mb-4 opacity-20" style={{ color: "#71767b" }} />
      <p style={{ color: "#71767b" }}>No jobs found. Seed demo data first!</p>
    </div>
  );
}

function CreateJobModal({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
  const [form, setForm] = useState({
    title: "", description: "", salaryMin: "", salaryMax: "", salaryCurrency: "LPA",
    skills: "", location: "Remote", jobType: "remote", experienceMin: "0", experienceMax: "3", openings: "1",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const usersRes = await fetch("/api/users");
      const usersData = await usersRes.json();
      const companyId = usersData.users?.find((u: any) => u.role === "company")?._id || usersData.users?.[0]?._id;
      await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyId, title: form.title, description: form.description,
          salary: { min: Number(form.salaryMin), max: Number(form.salaryMax), currency: form.salaryCurrency },
          skills: form.skills.split(",").map((s) => s.trim()).filter(Boolean),
          location: form.location, jobType: form.jobType,
          experienceMin: Number(form.experienceMin), experienceMax: Number(form.experienceMax),
          openings: Number(form.openings),
          lastDate: new Date(Date.now() + 30 * 86400000),
        }),
      });
      onCreated(); onClose();
    } catch {}
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-lg p-6 rounded-2xl animate-slide-up max-h-[90vh] overflow-y-auto"
        style={{ backgroundColor: "#000", border: "1px solid #2f3336" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold" style={{ color: "#e7e9ea" }}>Post a Job</h2>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-white/10 transition-colors" style={{ color: "#71767b" }}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3">
          {[
            { placeholder: "Job Title *", key: "title" },
          ].map(({ placeholder, key }) => (
            <input key={key} className="input-base" placeholder={placeholder} value={(form as any)[key]}
              onChange={(e) => setForm({ ...form, [key]: e.target.value })} />
          ))}
          <textarea className="textarea-base min-h-[100px]" placeholder="Job Description *"
            value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <div className="grid grid-cols-3 gap-2">
            <input className="input-base" placeholder="Min Salary" type="number" value={form.salaryMin} onChange={(e) => setForm({ ...form, salaryMin: e.target.value })} />
            <input className="input-base" placeholder="Max Salary" type="number" value={form.salaryMax} onChange={(e) => setForm({ ...form, salaryMax: e.target.value })} />
            <select className="input-base" value={form.salaryCurrency} onChange={(e) => setForm({ ...form, salaryCurrency: e.target.value })}>
              <option>LPA</option><option>month</option>
            </select>
          </div>
          <input className="input-base" placeholder="Skills (comma separated)" value={form.skills} onChange={(e) => setForm({ ...form, skills: e.target.value })} />
          <div className="grid grid-cols-2 gap-2">
            <input className="input-base" placeholder="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
            <select className="input-base" value={form.jobType} onChange={(e) => setForm({ ...form, jobType: e.target.value })}>
              {JOB_TYPES.filter((t) => t !== "all").map((t) => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <input className="input-base" placeholder="Min Exp" type="number" value={form.experienceMin} onChange={(e) => setForm({ ...form, experienceMin: e.target.value })} />
            <input className="input-base" placeholder="Max Exp" type="number" value={form.experienceMax} onChange={(e) => setForm({ ...form, experienceMax: e.target.value })} />
            <input className="input-base" placeholder="Openings" type="number" value={form.openings} onChange={(e) => setForm({ ...form, openings: e.target.value })} />
          </div>
        </div>

        <button onClick={handleSubmit} disabled={!form.title || !form.description || loading}
          className="w-full py-3 mt-5 rounded-full font-bold text-white disabled:opacity-50 hover:opacity-90 transition-opacity"
          style={{ background: "linear-gradient(135deg, #6366f1, #a855f7)" }}>
          {loading ? "Posting..." : "Post Job"}
        </button>
      </div>
    </div>
  );
}
