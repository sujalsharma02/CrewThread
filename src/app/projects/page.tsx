"use client";
import { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Code2, DollarSign, Clock, Tag, Plus, X, Search, Send } from "lucide-react";
import { formatDate, formatCurrency } from "@/lib/utils";

const STATUS_COLORS: Record<string, string> = {
  open: "bg-success/10 text-success",
  in_progress: "bg-warning/10 text-warning",
  completed: "bg-primary/10 text-primary",
  cancelled: "bg-danger/10 text-danger",
};

export default function ProjectsPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ status: "open" });
      if (search) params.set("skill", search);
      const res = await fetch(`/api/projects?${params}`);
      const data = await res.json();
      setProjects(data.projects || []);
    } catch {}
    setLoading(false);
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <MainLayout>
      {/* Header */}
      <div className="sticky top-0 z-30 glass border-b border-border px-4 py-3">
        <div className="flex items-center justify-between mb-3">
          <h1 className="font-bold text-text-primary text-lg flex items-center gap-2">
            <Code2 className="w-5 h-5 text-accent" />
            Freelance Projects
          </h1>
          <button
            onClick={() => setShowCreateForm(true)}
            className="btn-primary flex items-center gap-1.5 text-xs px-3 py-2"
          >
            <Plus className="w-3.5 h-3.5" />
            Post Project
          </button>
        </div>

        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && fetchProjects()}
              placeholder="Search by skill..."
              className="input-base pl-10"
            />
          </div>
          <button onClick={fetchProjects} className="btn-secondary px-4">Search</button>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="p-4 grid gap-4">
        {loading ? (
          <ProjectsSkeleton />
        ) : projects.length === 0 ? (
          <div className="py-12 text-center text-text-muted">
            <Code2 className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>No projects found. Seed demo data from the home page!</p>
          </div>
        ) : (
          projects.map((project) => (
            <ProjectCard key={project._id} project={project} onProposalSent={fetchProjects} />
          ))
        )}
      </div>

      {showCreateForm && (
        <CreateProjectModal onClose={() => setShowCreateForm(false)} onCreated={fetchProjects} />
      )}
    </MainLayout>
  );
}

function ProjectCard({ project, onProposalSent }: { project: any; onProposalSent: () => void }) {
  const [showProposal, setShowProposal] = useState(false);
  const owner = project.ownerId;
  const daysLeft = project.deadline
    ? Math.ceil((new Date(project.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : null;

  return (
    <div className="bg-surface-2 border border-border rounded-2xl p-5 card-hover">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          <img
            src={owner?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${owner?.username}`}
            alt={owner?.name}
            className="w-10 h-10 rounded-full bg-surface-3"
          />
          <div>
            <h3 className="font-bold text-text-primary">{project.title}</h3>
            <p className="text-xs text-text-muted">{owner?.name} · {formatDate(project.createdAt)}</p>
          </div>
        </div>
        <span className={`badge capitalize ${STATUS_COLORS[project.status]}`}>{project.status}</span>
      </div>

      <p className="text-text-secondary text-sm leading-relaxed mb-4 line-clamp-3">{project.description}</p>

      <div className="flex flex-wrap gap-1.5 mb-4">
        {project.skills?.map((skill: string) => (
          <span key={skill} className="badge bg-surface-3 text-text-secondary text-xs">
            {skill}
          </span>
        ))}
      </div>

      <div className="flex items-center gap-4 text-sm text-text-muted mb-4">
        <span className="flex items-center gap-1.5 font-semibold text-success">
          <DollarSign className="w-4 h-4" />
          {formatCurrency(project.budget)}
          <span className="font-normal text-text-muted capitalize">({project.pricingType})</span>
        </span>
        {daysLeft !== null && (
          <span className={`flex items-center gap-1.5 ${daysLeft <= 3 ? "text-danger" : "text-text-muted"}`}>
            <Clock className="w-4 h-4" />
            {daysLeft > 0 ? `${daysLeft} days left` : "Deadline passed"}
          </span>
        )}
        <span className="flex items-center gap-1.5">
          <Send className="w-4 h-4" />
          {project.proposals?.length || 0} proposals
        </span>
      </div>

      <button
        onClick={() => setShowProposal(!showProposal)}
        className="btn-primary w-full"
      >
        {showProposal ? "Cancel" : "Send Proposal"}
      </button>

      {showProposal && (
        <ProposalForm
          projectId={project._id}
          onSent={() => { setShowProposal(false); onProposalSent(); }}
        />
      )}
    </div>
  );
}

function ProposalForm({ projectId, onSent }: { projectId: string; onSent: () => void }) {
  const [price, setPrice] = useState("");
  const [deliveryTime, setDeliveryTime] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSend = async () => {
    if (!price || !deliveryTime || !message) return;
    setLoading(true);
    try {
      const usersRes = await fetch("/api/users");
      const usersData = await usersRes.json();
      const freelancerId = usersData.users?.[0]?._id;

      await fetch(`/api/projects/${projectId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ freelancerId, price: Number(price), deliveryTime, message }),
      });
      setSent(true);
      setTimeout(onSent, 1000);
    } catch {}
    setLoading(false);
  };

  if (sent) {
    return (
      <div className="mt-4 p-4 bg-success/10 border border-success/20 rounded-xl text-center text-success text-sm">
        ✅ Proposal sent successfully!
      </div>
    );
  }

  return (
    <div className="mt-4 p-4 bg-surface border border-border rounded-xl space-y-3 animate-slide-up">
      <h4 className="font-semibold text-text-primary text-sm">Your Proposal</h4>
      <div className="grid grid-cols-2 gap-3">
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted text-sm">₹</span>
          <input type="number" placeholder="Your price" value={price} onChange={(e) => setPrice(e.target.value)} className="input-base pl-8" />
        </div>
        <input type="text" placeholder="Delivery time (e.g. 7 days)" value={deliveryTime} onChange={(e) => setDeliveryTime(e.target.value)} className="input-base" />
      </div>
      <textarea placeholder="Why are you the best fit? (Cover message)" value={message} onChange={(e) => setMessage(e.target.value)} className="textarea-base min-h-[80px]" />
      <button
        onClick={handleSend}
        disabled={!price || !deliveryTime || !message || loading}
        className="btn-primary w-full disabled:opacity-50"
      >
        {loading ? "Sending..." : "Submit Proposal"}
      </button>
    </div>
  );
}

function ProjectsSkeleton() {
  return (
    <>
      {[1, 2].map((i) => (
        <div key={i} className="bg-surface-2 border border-border rounded-2xl p-5 space-y-3">
          <div className="flex gap-3">
            <div className="skeleton w-10 h-10 rounded-full" />
            <div className="flex-1 space-y-2">
              <div className="skeleton h-4 w-48 rounded" />
              <div className="skeleton h-3 w-32 rounded" />
            </div>
          </div>
          <div className="skeleton h-3 w-full rounded" />
          <div className="skeleton h-3 w-3/4 rounded" />
        </div>
      ))}
    </>
  );
}

function CreateProjectModal({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    budget: "",
    skills: "",
    pricingType: "fixed",
    deadline: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const usersRes = await fetch("/api/users");
      const usersData = await usersRes.json();
      const ownerId = usersData.users?.[0]?._id;

      await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ownerId,
          title: form.title,
          description: form.description,
          budget: Number(form.budget),
          skills: form.skills.split(",").map((s) => s.trim()).filter(Boolean),
          pricingType: form.pricingType,
          deadline: form.deadline ? new Date(form.deadline) : undefined,
        }),
      });
      onCreated();
      onClose();
    } catch {}
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div className="relative bg-surface border border-border rounded-2xl w-full max-w-lg p-6 shadow-card animate-slide-up max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-bold text-text-primary text-lg">Post a Project</h2>
          <button onClick={onClose}><X className="w-5 h-5 text-text-muted" /></button>
        </div>

        <div className="space-y-3">
          <input className="input-base" placeholder="Project Title *" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <textarea className="textarea-base min-h-[100px]" placeholder="Project Description *" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <div className="grid grid-cols-2 gap-2">
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">₹</span>
              <input className="input-base pl-8" placeholder="Budget" type="number" value={form.budget} onChange={(e) => setForm({ ...form, budget: e.target.value })} />
            </div>
            <select className="input-base" value={form.pricingType} onChange={(e) => setForm({ ...form, pricingType: e.target.value })}>
              <option value="fixed">Fixed Price</option>
              <option value="hourly">Hourly Rate</option>
            </select>
          </div>
          <input className="input-base" placeholder="Skills required (comma separated)" value={form.skills} onChange={(e) => setForm({ ...form, skills: e.target.value })} />
          <div>
            <label className="text-xs text-text-muted mb-1 block">Deadline</label>
            <input className="input-base" type="date" value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} />
          </div>
        </div>

        <button onClick={handleSubmit} disabled={!form.title || !form.description || !form.budget || loading} className="btn-primary w-full mt-5 py-3 disabled:opacity-50">
          {loading ? "Posting..." : "Post Project"}
        </button>
      </div>
    </div>
  );
}
