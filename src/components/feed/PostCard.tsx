"use client";
import { useState } from "react";
import Link from "next/link";
import { Heart, MessageCircle, Repeat2, Share, Bookmark, MoreHorizontal, Briefcase, Code2, Zap } from "lucide-react";
import { formatDate, cn } from "@/lib/utils";

interface PostCardProps {
  post: {
    _id: string;
    content: string;
    type: string;
    media?: string[];
    tags?: string[];
    likes: string[];
    comments: any[];
    reposts: string[];
    createdAt: string;
    authorId: {
      _id: string;
      name: string;
      username: string;
      avatar?: string;
      headline?: string;
      role?: string;
    };
  };
  currentUserId?: string;
}

const TYPE_BADGE: Record<string, { label: string; color: string }> = {
  job: { label: "Hiring", color: "#22c55e" },
  project: { label: "Project", color: "#a855f7" },
  event: { label: "Event", color: "#f59e0b" },
};

export default function PostCard({ post, currentUserId = "demo" }: PostCardProps) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes?.length || 0);
  const [reposted, setReposted] = useState(false);
  const [repostCount, setRepostCount] = useState(post.reposts?.length || 0);
  const [bookmarked, setBookmarked] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const typeBadge = TYPE_BADGE[post.type];

  const handleLike = async () => {
    const wasLiked = liked;
    setLiked(!wasLiked);
    setLikeCount((c) => wasLiked ? c - 1 : c + 1);
    try {
      await fetch(`/api/posts/${post._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "like", userId: currentUserId }),
      });
    } catch {}
  };

  const handleRepost = async () => {
    const wasReposted = reposted;
    setReposted(!wasReposted);
    setRepostCount((c) => wasReposted ? c - 1 : c + 1);
    try {
      await fetch(`/api/posts/${post._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "repost", userId: currentUserId }),
      });
    } catch {}
  };

  const author = post.authorId;
  if (!author) return null;

  return (
    <article
      className="flex gap-3 px-4 py-3 transition-colors hover:bg-white/[0.02] cursor-pointer relative"
      style={{ borderBottom: "1px solid #2f3336" }}
    >
      {/* Avatar */}
      <Link
        href={`/profile/${author.username}`}
        onClick={(e) => e.stopPropagation()}
        className="flex-shrink-0"
      >
        <img
          src={author.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${author.username}`}
          alt={author.name}
          title={author.name}
          className="w-11 h-11 rounded-full object-cover hover:opacity-90 transition-opacity"
          style={{ backgroundColor: "#1e2227" }}
        />
      </Link>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {/* Name row */}
        <div className="flex items-start justify-between gap-2 mb-0.5">
          <div className="flex items-center gap-1 flex-wrap leading-tight">
            <Link
              href={`/profile/${author.username}`}
              onClick={(e) => e.stopPropagation()}
              className="font-bold text-[15px] hover:underline"
              style={{ color: "#e7e9ea" }}
            >
              {author.name}
            </Link>
            <span className="text-[15px]" style={{ color: "#71767b" }}>@{author.username}</span>
            <span style={{ color: "#71767b" }}>·</span>
            <span className="text-[15px]" style={{ color: "#71767b" }}>{formatDate(post.createdAt)}</span>
            {typeBadge && (
              <span
                className="text-xs font-semibold px-2 py-0.5 rounded-full"
                style={{ color: typeBadge.color, backgroundColor: `${typeBadge.color}20` }}
              >
                {typeBadge.label}
              </span>
            )}
          </div>
          {/* More menu */}
          <button
            className="p-1.5 rounded-full transition-colors opacity-0 group-hover:opacity-100 hover:bg-indigo-500/10 flex-shrink-0"
            style={{ color: "#71767b" }}
            onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }}
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>

        {/* Post text */}
        <p
          className="text-[15px] leading-relaxed whitespace-pre-wrap break-words mb-3"
          style={{ color: "#e7e9ea" }}
        >
          {post.content}
        </p>

        {/* Media */}
        {post.media && post.media.length > 0 && (
          <div className="mb-3 rounded-2xl overflow-hidden" style={{ border: "1px solid #2f3336" }}>
            <img src={post.media[0]} alt="media" className="w-full max-h-80 object-cover" />
          </div>
        )}

        {/* Job/Project CTA card */}
        {(post.type === "job" || post.type === "project") && (
          <div
            className="mb-3 p-3 rounded-2xl flex items-center justify-between gap-3"
            style={{ border: "1px solid #2f3336", backgroundColor: "#16181c" }}
          >
            <div className="flex items-center gap-2">
              {post.type === "job"
                ? <Briefcase className="w-4 h-4 flex-shrink-0" style={{ color: "#6366f1" }} />
                : <Code2 className="w-4 h-4 flex-shrink-0" style={{ color: "#a855f7" }} />
              }
              <span className="text-sm" style={{ color: "#71767b" }}>
                {post.type === "job" ? "View job listings" : "View freelance projects"}
              </span>
            </div>
            <Link
              href={post.type === "job" ? "/jobs" : "/projects"}
              onClick={(e) => e.stopPropagation()}
              className="px-4 py-1.5 rounded-full font-bold text-sm text-white flex-shrink-0 hover:opacity-90 transition-opacity"
              style={{ backgroundColor: "#6366f1" }}
            >
              {post.type === "job" ? "Apply" : "Bid"}
            </Link>
          </div>
        )}

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {post.tags.map((tag) => (
              <span key={tag} className="text-sm font-medium hover:underline cursor-pointer" style={{ color: "#6366f1" }}>
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Action bar — exactly like X */}
        <div className="flex items-center justify-between max-w-[340px] -ml-2 mt-1">
          {/* Reply */}
          <ActionButton
            icon={<MessageCircle className="w-[18px] h-[18px]" />}
            count={post.comments?.length || 0}
            hoverColor="#1d9bf0"
            active={false}
            title="Reply"
          />

          {/* Repost */}
          <ActionButton
            icon={<Repeat2 className="w-[18px] h-[18px]" />}
            count={repostCount}
            hoverColor="#00ba7c"
            active={reposted}
            activeColor="#00ba7c"
            onClick={handleRepost}
            title="Repost"
          />

          {/* Like */}
          <ActionButton
            icon={<Heart className={cn("w-[18px] h-[18px]", liked && "fill-current")} />}
            count={likeCount}
            hoverColor="#f91880"
            active={liked}
            activeColor="#f91880"
            onClick={handleLike}
            title="Like"
          />

          {/* Bookmark */}
          <ActionButton
            icon={<Bookmark className={cn("w-[18px] h-[18px]", bookmarked && "fill-current")} />}
            count={0}
            hoverColor="#6366f1"
            active={bookmarked}
            activeColor="#6366f1"
            onClick={() => setBookmarked(!bookmarked)}
            title="Bookmark"
          />

          {/* Share */}
          <ActionButton
            icon={<Share className="w-[18px] h-[18px]" />}
            count={0}
            hoverColor="#1d9bf0"
            active={false}
            title="Share"
          />
        </div>
      </div>
    </article>
  );
}

function ActionButton({
  icon,
  count,
  hoverColor,
  active,
  activeColor,
  title,
  onClick,
}: {
  icon: React.ReactNode;
  count: number;
  hoverColor: string;
  active: boolean;
  activeColor?: string;
  title?: string;
  onClick?: () => void;
}) {
  return (
    <button
      title={title}
      onClick={(e) => { e.stopPropagation(); onClick?.(); }}
      className="flex items-center gap-1 p-2 rounded-full transition-all group/action"
      style={{ color: active && activeColor ? activeColor : "#71767b" }}
      onMouseEnter={(e) => {
        const el = e.currentTarget;
        el.style.backgroundColor = `${hoverColor}20`;
        el.style.color = active && activeColor ? activeColor : hoverColor;
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget;
        el.style.backgroundColor = "transparent";
        el.style.color = active && activeColor ? activeColor : "#71767b";
      }}
    >
      {icon}
      {count > 0 && (
        <span className="text-xs font-medium">{count >= 1000 ? `${(count / 1000).toFixed(1)}K` : count}</span>
      )}
    </button>
  );
}
