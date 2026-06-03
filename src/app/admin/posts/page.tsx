"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { adminGetAllPosts, deletePost, publishPost, archivePost, unpublishPost } from "@/lib/firebase";
import { isFirebaseConfigured } from "@/lib/firebaseConfig";
import { useAuth } from "@/contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import type { CmsPost, PostStatus } from "@/lib/cms-types";

const STATUS_FILTERS: { label: string; value: PostStatus | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Drafts", value: "draft" },
  { label: "In Review", value: "review" },
  { label: "Published", value: "published" },
  { label: "Scheduled", value: "scheduled" },
  { label: "Archived", value: "archived" },
];

function formatDate(dateStr: string | undefined): string {
  if (!dateStr) return "Unknown";
  return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function AdminPostsPage() {
  const { can } = useAuth();
  const [posts, setPosts] = useState<CmsPost[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [statusFilter, setStatusFilter] = useState<PostStatus | "all">("all");
  const [search, setSearch] = useState("");

  // Action states
  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await adminGetAllPosts();
        setPosts(data);
      } catch (err) {
        console.error("Failed to fetch posts:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [can]);

  // Click outside to close menu
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filtered = posts.filter((post) => {
    if (statusFilter !== "all" && post.status !== statusFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      if (!post.title?.toLowerCase().includes(q) && !post.slug?.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  const handleQuickAction = async (slug: string, action: "publish" | "archive" | "unpublish") => {
    setActionLoading(slug);
    try {
      if (action === "publish") await publishPost(slug);
      if (action === "archive") await archivePost(slug);
      if (action === "unpublish") await unpublishPost(slug);
      setPosts(await adminGetAllPosts());
    } catch (err) {
      console.error(err);
      alert("Action failed.");
    } finally {
      setActionLoading(null);
      setMenuOpen(null);
    }
  };

  const handleDelete = async (slug: string) => {
    if (!confirm("Are you sure you want to delete this article permanently?")) return;
    setActionLoading(slug);
    try {
      await deletePost(slug);
      setPosts(posts.filter((p) => p.slug !== slug));
    } catch (err) {
      console.error(err);
      alert("Failed to delete post.");
    } finally {
      setActionLoading(null);
      setMenuOpen(null);
    }
  };

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "6rem 0" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div className="cms-saving" style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--studio-accent)" }} />
          <span style={{ fontSize: "0.875rem", color: "var(--studio-text-3)", fontWeight: 500 }}>Loading articles...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="cms-animate-in" style={{ display: "flex", flexDirection: "column", gap: "1.75rem" }}>

      {/* ── Page Header ──────────────────────────────────────────────── */}
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
        <div>
          <h1 style={{ fontSize: "1.75rem", fontWeight: 700, letterSpacing: "-0.03em", color: "var(--studio-text-1)", lineHeight: 1.1 }}>
            Articles
          </h1>
          <p style={{ fontSize: "0.875rem", color: "var(--studio-text-3)", marginTop: 6, fontWeight: 400 }}>
            Manage and publish your writing.
          </p>
        </div>
        <Link href="/admin/posts/new" className="cms-btn" style={{ textDecoration: "none", background: "var(--studio-accent)", color: "var(--studio-surface)", border: "none" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          New Article
        </Link>
      </div>

      {!isFirebaseConfigured && (
        <div style={{ padding: "12px 16px", borderRadius: "var(--studio-r-md)", background: "var(--studio-amber-bg)", border: "1px solid rgba(245,158,11,0.2)", display: "flex", gap: 10, alignItems: "center" }}>
           <div style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--studio-amber)" }} />
           <p style={{ fontSize: "0.8125rem", color: "var(--studio-amber)", fontWeight: 600 }}>Sandbox mode: Actions disabled.</p>
        </div>
      )}

      {/* ── Filters & Search ──────────────────────────────────────────── */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <div style={{ display: "flex", gap: 8 }}>
          {STATUS_FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setStatusFilter(f.value)}
              style={{
                background: statusFilter === f.value ? "var(--studio-text-1)" : "transparent",
                color: statusFilter === f.value ? "var(--studio-surface)" : "var(--studio-text-2)",
                border: "none",
                borderRadius: "var(--studio-r-sm)",
                padding: "6px 12px",
                fontSize: "0.8125rem",
                fontWeight: 500,
                cursor: "pointer",
                transition: "all 0.15s",
              }}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div style={{ position: "relative", width: 220 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "var(--studio-text-3)", pointerEvents: "none" }}>
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            type="text"
            placeholder="Search articles..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="cms-input"
            style={{ paddingLeft: 32, fontSize: "0.8125rem", padding: "8px 10px 8px 32px" }}
          />
        </div>
      </div>

      {/* ── Data Table ────────────────────────────────────────────────── */}
      <div style={{ background: "var(--studio-surface)", border: "1px solid var(--studio-border)", borderRadius: "var(--studio-r-lg)", boxShadow: "var(--studio-shadow-sm)", overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--studio-border)", background: "var(--studio-surface-subtle)" }}>
                <th style={{ padding: "12px 20px", fontSize: "0.75rem", fontWeight: 600, color: "var(--studio-text-3)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Title</th>
                <th style={{ padding: "12px 20px", fontSize: "0.75rem", fontWeight: 600, color: "var(--studio-text-3)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Status</th>
                <th style={{ padding: "12px 20px", fontSize: "0.75rem", fontWeight: 600, color: "var(--studio-text-3)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Author</th>
                <th style={{ padding: "12px 20px", fontSize: "0.75rem", fontWeight: 600, color: "var(--studio-text-3)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Date</th>
                <th style={{ padding: "12px 20px", fontSize: "0.75rem", fontWeight: 600, color: "var(--studio-text-3)", textTransform: "uppercase", letterSpacing: "0.05em", textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence initial={false}>
                {filtered.length > 0 ? (
                  filtered.map((post) => (
                    <motion.tr
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, height: 0, display: "none" }}
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      key={post.slug}
                      style={{ borderBottom: "1px solid var(--studio-border)", background: "var(--studio-surface)" }}
                    >
                      <td style={{ padding: "14px 20px" }}>
                        <Link href={`/admin/posts/edit/${post.slug}`} style={{ fontSize: "0.875rem", fontWeight: 500, color: "var(--studio-text-1)", textDecoration: "none", display: "flex", alignItems: "center", gap: 8 }}>
                          {post.title || "Untitled Document"}
                          {post.featured && <span style={{ color: "var(--studio-amber)" }}>★</span>}
                        </Link>
                      </td>
                      <td style={{ padding: "14px 20px" }}>
                        <span className={`cms-pill cms-pill-${post.status}`}>{post.status}</span>
                      </td>
                      <td style={{ padding: "14px 20px", fontSize: "0.8125rem", color: "var(--studio-text-2)" }}>
                        {post.authorName}
                      </td>
                      <td style={{ padding: "14px 20px", fontSize: "0.8125rem", color: "var(--studio-text-3)" }}>
                        {formatDate(post.updatedAt)}
                      </td>
                      <td style={{ padding: "14px 20px", textAlign: "right", position: "relative" }}>
                        <div ref={menuOpen === post.slug ? menuRef : null}>
                          <button
                            onClick={(e) => { e.stopPropagation(); setMenuOpen(menuOpen === post.slug ? null : post.slug); }}
                            style={{ background: "transparent", border: "none", color: "var(--studio-text-3)", cursor: "pointer", padding: "4px 8px", borderRadius: "var(--studio-r-sm)" }}
                            onMouseEnter={e => e.currentTarget.style.background = "var(--studio-surface-subtle)"}
                            onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                          >
                            ⋯
                          </button>
                          
                          {/* Actions Dropdown */}
                          {menuOpen === post.slug && (
                            <div style={{ position: "absolute", right: 20, top: "calc(100% - 10px)", width: 140, background: "var(--studio-surface)", border: "1px solid var(--studio-border)", borderRadius: "var(--studio-r-md)", padding: 4, zIndex: 50, boxShadow: "var(--studio-shadow-md)", textAlign: "left" }}>
                              <Link href={`/admin/posts/edit/${post.slug}`} onClick={() => setMenuOpen(null)} style={{ display: "block", padding: "6px 10px", fontSize: "0.8125rem", color: "var(--studio-text-1)", textDecoration: "none", borderRadius: 4 }}>
                                Edit
                              </Link>
                              {can("posts.publish") && (post.status === "draft" || post.status === "review") && (
                                <button onClick={() => handleQuickAction(post.slug, "publish")} style={{ display: "block", width: "100%", textAlign: "left", padding: "6px 10px", fontSize: "0.8125rem", color: "var(--studio-green)", background: "transparent", border: "none", borderRadius: 4, cursor: "pointer" }}>
                                  {actionLoading === post.slug ? "Wait..." : "Publish"}
                                </button>
                              )}
                              {can("posts.publish") && post.status === "published" && (
                                <button onClick={() => handleQuickAction(post.slug, "archive")} style={{ display: "block", width: "100%", textAlign: "left", padding: "6px 10px", fontSize: "0.8125rem", color: "var(--studio-amber)", background: "transparent", border: "none", borderRadius: 4, cursor: "pointer" }}>
                                  {actionLoading === post.slug ? "Wait..." : "Archive"}
                                </button>
                              )}
                              {can("posts.delete") && (
                                <button onClick={() => handleDelete(post.slug)} style={{ display: "block", width: "100%", textAlign: "left", padding: "6px 10px", fontSize: "0.8125rem", color: "var(--studio-red)", background: "transparent", border: "none", borderRadius: 4, cursor: "pointer", marginTop: 4, borderTop: "1px solid var(--studio-border)" }}>
                                  {actionLoading === post.slug ? "Wait..." : "Delete"}
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} style={{ padding: "60px 20px", textAlign: "center", fontSize: "0.875rem", color: "var(--studio-text-3)" }}>
                      {search ? `No articles matching "${search}"` : "No articles found"}
                    </td>
                  </tr>
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
