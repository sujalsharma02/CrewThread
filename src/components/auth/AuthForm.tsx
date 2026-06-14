"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2, User, Briefcase } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";

type Mode = "login" | "signup";

export default function AuthForm({ mode }: { mode: Mode }) {
  const router = useRouter();
  const { refresh } = useAuth();

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [identifier, setIdentifier] = useState(""); // email or username (login)
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"jobseeker" | "company">("jobseeker");
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const isSignup = mode === "signup";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const endpoint = isSignup ? "/api/auth/signup" : "/api/auth/login";
      const payload = isSignup
        ? { name, username, email, password, role }
        : { identifier, password };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong");
        setLoading(false);
        return;
      }

      await refresh();
      router.push("/");
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div
      className="flex min-h-screen items-center justify-center px-4"
      style={{ backgroundColor: "#000", color: "#e7e9ea" }}
    >
      {/* ambient gradient glow */}
      <div
        className="pointer-events-none fixed inset-0 opacity-40"
        style={{
          background:
            "radial-gradient(600px circle at 50% 0%, rgba(99,102,241,0.18), transparent 60%)",
        }}
      />

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <Link href="/" className="mb-8 flex flex-col items-center font-black leading-none tracking-tight select-none">
          <div className="text-3xl" style={{ color: "#fff" }}>Crew</div>
          <div
            className="text-2xl"
            style={{
              background: "linear-gradient(135deg, #6366f1, #a855f7)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Thread
          </div>
        </Link>

        <div
          className="rounded-3xl p-7"
          style={{ backgroundColor: "#16181c", border: "1px solid #2f3336" }}
        >
          <h1 className="text-2xl font-bold mb-1" style={{ color: "#e7e9ea" }}>
            {isSignup ? "Create your account" : "Welcome back"}
          </h1>
          <p className="text-sm mb-6" style={{ color: "#71767b" }}>
            {isSignup
              ? "Join the network for jobs, freelance & careers."
              : "Log in to continue to CrewThread."}
          </p>

          {error && (
            <div
              className="mb-4 rounded-xl px-4 py-3 text-sm"
              style={{
                backgroundColor: "rgba(244,63,94,0.1)",
                color: "#fb7185",
                border: "1px solid rgba(244,63,94,0.3)",
              }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {isSignup && (
              <>
                <Field
                  label="Full name"
                  value={name}
                  onChange={setName}
                  placeholder="Jane Doe"
                  autoFocus
                />
                <Field
                  label="Username"
                  value={username}
                  onChange={(v) => setUsername(v.toLowerCase().replace(/[^a-z0-9_]/g, ""))}
                  placeholder="janedoe"
                  prefix="@"
                />

                {/* Role selector */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium" style={{ color: "#71767b" }}>
                    I am a
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <RoleButton
                      active={role === "jobseeker"}
                      onClick={() => setRole("jobseeker")}
                      icon={<User className="h-4 w-4" />}
                      label="Job seeker"
                    />
                    <RoleButton
                      active={role === "company"}
                      onClick={() => setRole("company")}
                      icon={<Briefcase className="h-4 w-4" />}
                      label="Company"
                    />
                  </div>
                </div>
              </>
            )}

            {isSignup ? (
              <Field
                label="Email"
                type="email"
                value={email}
                onChange={setEmail}
                placeholder="you@example.com"
              />
            ) : (
              <Field
                label="Email or username"
                value={identifier}
                onChange={setIdentifier}
                placeholder="you@example.com"
                autoFocus
              />
            )}

            {/* Password */}
            <div>
              <label className="mb-1.5 block text-sm font-medium" style={{ color: "#71767b" }}>
                Password
              </label>
              <div className="relative">
                <input
                  type={showPwd ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={isSignup ? "At least 6 characters" : "••••••••"}
                  className="w-full rounded-xl px-4 py-3 pr-11 text-sm outline-none transition-colors focus:border-indigo-500"
                  style={{ backgroundColor: "#000", color: "#e7e9ea", border: "1px solid #2f3336" }}
                />
                <button
                  type="button"
                  onClick={() => setShowPwd((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ color: "#71767b" }}
                  tabIndex={-1}
                >
                  {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 flex items-center justify-center gap-2 rounded-full py-3 font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
              style={{ background: "linear-gradient(135deg, #6366f1, #a855f7)" }}
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {isSignup ? "Create account" : "Log in"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm" style={{ color: "#71767b" }}>
            {isSignup ? "Already have an account? " : "Don't have an account? "}
            <Link
              href={isSignup ? "/login" : "/signup"}
              className="font-semibold hover:underline"
              style={{ color: "#818cf8" }}
            >
              {isSignup ? "Log in" : "Sign up"}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  prefix,
  autoFocus,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  prefix?: string;
  autoFocus?: boolean;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium" style={{ color: "#71767b" }}>
        {label}
      </label>
      <div className="relative">
        {prefix && (
          <span
            className="absolute left-4 top-1/2 -translate-y-1/2 text-sm"
            style={{ color: "#71767b" }}
          >
            {prefix}
          </span>
        )}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoFocus={autoFocus}
          className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-colors focus:border-indigo-500"
          style={{
            backgroundColor: "#000",
            color: "#e7e9ea",
            border: "1px solid #2f3336",
            paddingLeft: prefix ? 28 : undefined,
          }}
        />
      </div>
    </div>
  );
}

function RoleButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold transition-colors"
      style={{
        backgroundColor: active ? "rgba(99,102,241,0.15)" : "#000",
        color: active ? "#818cf8" : "#71767b",
        border: active ? "1px solid #6366f1" : "1px solid #2f3336",
      }}
    >
      {icon}
      {label}
    </button>
  );
}
