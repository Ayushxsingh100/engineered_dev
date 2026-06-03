"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState } from "react";
import Link from "next/link";
import { adminGetAllPosts, adminGetAllProjects } from "@/lib/firebase";
import { isFirebaseConfigured } from "@/lib/firebaseConfig";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import type { CmsPost } from "@/lib/cms-types";

function formatDate(dateStr: string | undefined): string {
  if (!dateStr) return "Unknown";
  return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function AdminDashboardOverview() {
  const { can } = useAuth();
  const [posts, setPosts] = useState<CmsPost[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [allPosts, allProjects] = await Promise.all([
          adminGetAllPosts(),
          adminGetAllProjects(),
        ]);
        setPosts(allPosts);
        setProjects(allProjects);
      } catch (err) {
        console.error("Failed to fetch admin data:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [can]);

  const draftPosts = posts.filter((p) => p.status === "draft");
  const publishedPosts = posts.filter((p) => p.status === "published");
  const reviewPosts = posts.filter((p) => p.status === "review");

  // Combine and sort recent activity
  const recentActivity = [...posts]
    .sort((a, b) => (b.updatedAt || "").localeCompare(a.updatedAt || ""))
    .slice(0, 8);

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "6rem 0" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div className="cms-saving" style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--studio-accent)" }} />
          <span style={{ fontSize: "0.875rem", color: "var(--studio-text-3)", fontWeight: 500 }}>Loading workspace...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="cms-animate-in" style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
        <div>
          <h1 style={{ fontSize: "1.75rem", fontWeight: 700, letterSpacing: "-0.03em", color: "var(--studio-text-1)", lineHeight: 1.1 }}>
            Dashboard
          </h1>
          <p style={{ fontSize: "0.875rem", color: "var(--studio-text-3)", marginTop: 6, fontWeight: 400 }}>
            Overview of your content and recent activity.
          </p>
        </div>
        <Link href="/admin/posts/new" className="cms-btn cms-btn-primary" style={{ textDecoration: "none", background: "var(--studio-accent)", color: "var(--studio-surface)" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          New Article
        </Link>
      </div>

      {!isFirebaseConfigured && (
        <div style={{ padding: "12px 16px", borderRadius: "var(--studio-r-md)", background: "var(--studio-amber-bg)", border: "1px solid rgba(245,158,11,0.2)", display: "flex", gap: 10, alignItems: "center" }}>
           <div style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--studio-amber)" }} />
           <p style={{ fontSize: "0.8125rem", color: "var(--studio-amber)", fontWeight: 600 }}>Sandbox mode: Running with local static data.</p>
        </div>
      )}

      {/* ── Metrics Grid ────────────────────────────────────────────────── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
        <MetricCard title="Total Articles" value={posts.length.toString()} trend="All time" />
        <MetricCard title="Published" value={publishedPosts.length.toString()} trend="Live on site" />
        <MetricCard title="Active Drafts" value={draftPosts.length.toString()} trend={reviewPosts.length > 0 ? `${reviewPosts.length} in review` : "Needs attention"} />
        <MetricCard title="Case Studies" value={projects.length.toString()} trend="Portfolio" />
      </div>

      {/* ── Recent Activity Table ───────────────────────────────────────── */}
      <div style={{ background: "var(--studio-surface)", border: "1px solid var(--studio-border)", borderRadius: "var(--studio-r-lg)", boxShadow: "var(--studio-shadow-sm)", overflow: "hidden" }}>
        <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--studio-border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 style={{ fontSize: "0.9375rem", fontWeight: 600, color: "var(--studio-text-1)" }}>Recent Activity</h2>
          <Link href="/admin/posts" style={{ fontSize: "0.8125rem", color: "var(--studio-text-2)", textDecoration: "none", fontWeight: 500 }}>
            View all →
          </Link>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--studio-border)", background: "var(--studio-surface-subtle)" }}>
                <th style={{ padding: "12px 20px", fontSize: "0.75rem", fontWeight: 600, color: "var(--studio-text-3)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Title</th>
                <th style={{ padding: "12px 20px", fontSize: "0.75rem", fontWeight: 600, color: "var(--studio-text-3)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Status</th>
                <th style={{ padding: "12px 20px", fontSize: "0.75rem", fontWeight: 600, color: "var(--studio-text-3)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Author</th>
                <th style={{ padding: "12px 20px", fontSize: "0.75rem", fontWeight: 600, color: "var(--studio-text-3)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Last Modified</th>
              </tr>
            </thead>
            <tbody>
              {recentActivity.length > 0 ? (
                recentActivity.map((post) => (
                  <tr key={post.slug} style={{ borderBottom: "1px solid var(--studio-border)", transition: "background 0.15s" }} onMouseEnter={e => e.currentTarget.style.background = "var(--studio-surface-subtle)"} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                    <td style={{ padding: "14px 20px" }}>
                      <Link href={`/admin/posts/edit/${post.slug}`} style={{ fontSize: "0.875rem", fontWeight: 500, color: "var(--studio-text-1)", textDecoration: "none" }}>
                        {post.title || "Untitled Document"}
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
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} style={{ padding: "40px 20px", textAlign: "center", fontSize: "0.875rem", color: "var(--studio-text-3)" }}>
                    No recent activity found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

function MetricCard({ title, value, trend }: { title: string; value: string; trend: string }) {
  return (
    <motion.div 
      style={{
        background: "var(--studio-surface)",
        border: "1px solid var(--studio-border)",
        borderRadius: "var(--studio-r-lg)",
        padding: "20px",
        boxShadow: "var(--studio-shadow-sm)",
      }}
      whileHover={{ y: -2, boxShadow: "var(--studio-shadow-md)", borderColor: "var(--studio-border-strong)" }}
    >
      <p style={{ fontSize: "0.8125rem", fontWeight: 600, color: "var(--studio-text-3)", marginBottom: 8 }}>{title}</p>
      <div style={{ fontSize: "2rem", fontWeight: 700, color: "var(--studio-text-1)", letterSpacing: "-0.04em", lineHeight: 1 }}>{value}</div>
      <p style={{ fontSize: "0.75rem", color: "var(--studio-text-2)", marginTop: 12, fontWeight: 500 }}>{trend}</p>
    </motion.div>
  );
}
