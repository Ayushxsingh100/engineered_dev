"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState } from "react";
import Link from "next/link";
import { adminGetAllProjects, deleteProject } from "@/lib/firebase";
import { isFirebaseConfigured } from "@/lib/firebaseConfig";

export default function AdminProjectsListPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProjects() {
      try {
        const allProjects = await adminGetAllProjects();
        setProjects(allProjects);
      } catch (err) {
        console.error("Failed to fetch admin projects:", err);
      } finally {
        setLoading(false);
      }
    }
    loadProjects();
  }, []);

  const handleDelete = async (slug: string) => {
    if (!isFirebaseConfigured) { alert("Disabled in sandbox mode."); return; }
    if (!confirm("Delete this case study permanently?")) return;
    try {
      await deleteProject(slug);
      setProjects((prev) => prev.filter((p) => p.slug !== slug));
    } catch (err) {
      alert("Failed to delete project.");
    }
  };

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "4rem 0" }}>
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-accent cms-saving" />
          <span style={{ fontSize: "0.8125rem", color: "var(--cms-text-muted)" }}>Loading projects...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="cms-animate-in" style={{ display: "flex", flexDirection: "column", gap: "1.75rem" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
        <div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 700, letterSpacing: "-0.02em", color: "var(--studio-text-1)", lineHeight: 1.2 }}>
            Case Studies
          </h1>
          <p style={{ fontSize: "0.875rem", color: "var(--studio-text-3)", marginTop: 4 }}>Visual work &amp; projects</p>
        </div>
        <Link href="/admin/projects/new" className="cms-btn cms-btn-accent" style={{ textDecoration: "none" }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          New Case Study
        </Link>
      </div>

      {/* Project Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 12 }}>
        {projects.map((project) => (
          <Link key={project.slug} href={`/admin/projects/edit/${project.slug}`} style={{ textDecoration: "none", color: "inherit" }}>
            <div className="cms-card cms-card-interactive" style={{ display: "flex", flexDirection: "column", overflow: "hidden", padding: 0, height: "100%" }}>
            {/* Cover */}
            {project.coverImage ? (
              <div style={{ width: "100%", height: 160, overflow: "hidden", background: "#f3f4f6", borderBottom: "1px solid var(--cms-border-soft)" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={project.coverImage} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
            ) : (
              <div style={{ width: "100%", height: 160, overflow: "hidden", background: "#f3f4f6", borderBottom: "1px solid var(--cms-border-soft)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.2, color: "#111827" }}><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
              </div>
            )}

            <div style={{ padding: "1.25rem", display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: "0.6875rem", color: "var(--cms-text-muted)", fontWeight: 500 }}>{project.category}</span>
                {project.featured && (
                  <span style={{ fontSize: "0.625rem", color: "var(--accent)", fontWeight: 600 }}>★</span>
                )}
              </div>

              <h2 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--text-primary)", lineHeight: 1.3 }}>
                {project.name}
              </h2>

              {project.description && (
                <p style={{
                  fontSize: "0.8125rem", color: "var(--text-secondary)", fontWeight: 400, lineHeight: 1.5,
                  overflow: "hidden", textOverflow: "ellipsis",
                  display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical",
                }}>
                  {project.description}
                </p>
              )}

              {project.techStack && project.techStack.length > 0 && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: "auto", paddingTop: 12 }}>
                  {project.techStack.slice(0, 5).map((tech: string) => (
                    <span key={tech} style={{
                      padding: "2px 8px", fontSize: "0.6875rem", fontWeight: 500,
                      borderRadius: 4, background: "#f3f4f6", color: "#4b5563",
                    }}>
                      {tech}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </Link>
        ))}
      </div>

      {projects.length === 0 && (
        <div className="cms-empty">
          <p>No case studies yet</p>
          <Link href="/admin/projects/new" className="cms-btn cms-btn-primary" style={{ textDecoration: "none" }}>
            Create your first case study →
          </Link>
        </div>
      )}
    </div>
  );
}
