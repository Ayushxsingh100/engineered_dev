"use client";
/* eslint-disable @typescript-eslint/no-explicit-any, react-hooks/exhaustive-deps */

import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { uploadImage } from "@/lib/firebase";
import { isFirebaseConfigured } from "@/lib/firebaseConfig";
import Link from "next/link";
import { ImageCropperModal } from "./ImageCropperModal";

// MDXEditor must be imported dynamically since it relies on the browser DOM
const BlockEditor = dynamic(() => import("./BlockEditor"), {
  ssr: false,
  loading: () => (
    <div style={{ padding: "4rem", textAlign: "center", color: "var(--cms-text-muted)" }}>
      Loading editor...
    </div>
  ),
});

interface ProjectEditorProps {
  project?: any;
  onSave: (slug: string, data: any) => Promise<void>;
}

const CONTENT_BLOCKS = [
  { key: "architecture", label: "Architecture" },
  { key: "scalability", label: "Scalability" },
  { key: "implementation", label: "Implementation" },
  { key: "lessonsLearned", label: "Lessons Learned" },
] as const;

type ContentBlockKey = typeof CONTENT_BLOCKS[number]["key"];

export function ProjectEditor({ project, onSave }: ProjectEditorProps) {
  // Core fields
  const [title, setTitle] = useState(project?.name || project?.title || "");
  const [slug, setSlug] = useState(project?.slug || "");
  const [description, setDescription] = useState(project?.description || "");
  const [category, setCategory] = useState(project?.category || "Backend Engineering");
  const [techStackInput, setTechStackInput] = useState(project?.techStack?.join(", ") || "");
  const [githubUrl, setGithubUrl] = useState(project?.githubUrl || "");
  const [liveUrl, setLiveUrl] = useState(project?.liveUrl || "");
  const [coverImageUrl, setCoverImageUrl] = useState(project?.coverImage || project?.coverImageUrl || "");
  const [featured, setFeatured] = useState(!!project?.featured);
  
  const [challenges, setChallenges] = useState<string[]>(project?.challenges || []);
  const [newChallenge, setNewChallenge] = useState("");

  const [architecture, setArchitecture] = useState(project?.architecture || "");
  const [scalability, setScalability] = useState(project?.scalability || "");
  const [implementation, setImplementation] = useState(project?.implementation || "");
  const [lessonsLearned, setLessonsLearned] = useState(project?.lessonsLearned || "");

  const [activeContentBlock, setActiveContentBlock] = useState<ContentBlockKey>("architecture");

  // UI state
  const [uploading, setUploading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const [cropImageSrc, setCropImageSrc] = useState<string | null>(null);

  const titleRef = useRef<HTMLTextAreaElement>(null);

  const generateSlug = (val: string) =>
    val.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-");

  const handleTitleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setTitle(val);
    if (!project) setSlug(generateSlug(val));
  };

  useEffect(() => {
    if (titleRef.current) {
      titleRef.current.style.height = "auto";
      titleRef.current.style.height = titleRef.current.scrollHeight + "px";
    }
  }, [title]);

  const getActiveText = () => {
    switch (activeContentBlock) {
      case "architecture": return architecture;
      case "scalability": return scalability;
      case "implementation": return implementation;
      case "lessonsLearned": return lessonsLearned;
      default: return "";
    }
  };

  const handleTextChange = (val: string) => {
    switch (activeContentBlock) {
      case "architecture": setArchitecture(val); break;
      case "scalability": setScalability(val); break;
      case "implementation": setImplementation(val); break;
      case "lessonsLearned": setLessonsLearned(val); break;
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!isFirebaseConfigured) { alert("Image uploads disabled in sandbox mode."); return; }
    if (!slug) { alert("Please set a title/slug before uploading a cover image."); return; }
    
    setCropImageSrc(URL.createObjectURL(file));
    e.target.value = "";
  };

  const handleCropComplete = async (croppedFile: File) => {
    setCropImageSrc(null);
    setUploading(true);
    try {
      const storagePath = `projects/${slug.trim()}/cover-${Date.now()}`;
      const url = await uploadImage(croppedFile, storagePath);
      setCoverImageUrl(url);
    } catch (err: any) {
      alert(err.message || "Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const addChallenge = () => {
    if (!newChallenge.trim()) return;
    setChallenges((prev) => [...prev, newChallenge.trim()]);
    setNewChallenge("");
  };

  const removeChallenge = (index: number) => {
    setChallenges((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleSave = async () => {
    setError("");
    setSuccessMsg("");
    setSaveLoading(true);

    if (!title.trim() || !slug.trim()) {
      setError("Title and Slug are required.");
      setSaveLoading(false);
      return;
    }

    const techStack = techStackInput.split(",").map((t: string) => t.trim()).filter((t: string) => t !== "");

    const projectData = {
      title, name: title, description, category, techStack, githubUrl,
      liveUrl: liveUrl.trim() || null,
      coverImageUrl, coverImage: coverImageUrl, featured, challenges,
      architecture, scalability, implementation, lessonsLearned,
      publishedAt: project?.publishedAt || new Date().toISOString(),
    };

    try {
      await onSave(slug.trim(), projectData);
      setSuccessMsg("Project saved successfully!");
      setLastSaved(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err: any) {
      setError(err.message || "Failed to save project.");
    } finally {
      setSaveLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", gap: "2rem", minHeight: "100vh", position: "relative" }}>
      
      {cropImageSrc && (
        <ImageCropperModal
          imageSrc={cropImageSrc}
          onCropCompleteAction={handleCropComplete}
          onCancel={() => setCropImageSrc(null)}
          aspectRatio={21 / 9}
        />
      )}

      {/* ── Toasts ───────────────────────────────────────────── */}
      {error && (
        <div style={{
          position: "fixed", top: 20, right: 20, zIndex: 100,
          padding: "12px 20px", borderRadius: 10,
          background: "#fef2f2", border: "1px solid #fecaca", color: "#dc2626",
          fontSize: "0.8125rem", fontWeight: 500, maxWidth: 400,
          animation: "cms-fade-in 0.3s var(--cms-ease) both",
          boxShadow: "var(--cms-shadow-hover)"
        }}>
          {error}
          <button onClick={() => setError("")} style={{ marginLeft: 12, opacity: 0.5, cursor: "pointer", border: "none", background: "none", color: "inherit" }}>✕</button>
        </div>
      )}
      {successMsg && (
        <div style={{
          position: "fixed", top: 20, right: 20, zIndex: 100,
          padding: "12px 20px", borderRadius: 10,
          background: "#f0fdf4", border: "1px solid #bbf7d0", color: "#16a34a",
          fontSize: "0.8125rem", fontWeight: 500,
          animation: "cms-fade-in 0.3s var(--cms-ease) both",
          boxShadow: "var(--cms-shadow-hover)"
        }}>
          {successMsg}
        </div>
      )}

      {/* ── Main Canvas (75%) ────────────────────────────────── */}
      <div style={{ flex: "1 1 0%", minWidth: 0, paddingBottom: "10rem" }}>
        
        {/* Breadcrumb / Back */}
        <div style={{ marginBottom: "2.5rem", padding: "2rem 2rem 0 2rem" }}>
          <Link href="/admin/projects" style={{ 
            fontSize: "0.8125rem", color: "var(--studio-text-3)", textDecoration: "none", 
            display: "inline-flex", alignItems: "center", gap: 6, fontWeight: 500,
            transition: "color 0.15s var(--studio-ease)"
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "var(--studio-text-1)")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "var(--studio-text-3)")}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
            Back to Case Studies
          </Link>
        </div>

        <div style={{ maxWidth: 840, margin: "0 auto", padding: "0 2rem" }}>
          
          {/* Cover Image Area */}
          <div style={{ marginBottom: "2rem" }}>
            {!coverImageUrl ? (
              <label style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                padding: "8px 16px", borderRadius: "var(--studio-r-full)",
                background: "var(--studio-surface-subtle)", color: "var(--studio-text-2)",
                border: "1px solid var(--studio-border)",
                fontSize: "0.8125rem", fontWeight: 500, cursor: "pointer",
                transition: "all 0.2s var(--studio-ease)"
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "var(--studio-border)"; e.currentTarget.style.color = "var(--studio-text-1)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "var(--studio-surface-subtle)"; e.currentTarget.style.color = "var(--studio-text-2)"; }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                {uploading ? "Uploading..." : "Add Cover Image"}
                <input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading} style={{ display: "none" }} />
              </label>
            ) : (
              <div style={{ position: "relative", width: "100%", aspectRatio: "21/9", borderRadius: "var(--studio-r-lg)", overflow: "hidden", background: "var(--studio-surface-subtle)", border: "1px solid var(--studio-border)" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={coverImageUrl} alt="Cover" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                <button type="button" onClick={() => setCoverImageUrl("")} style={{
                  position: "absolute", top: 12, right: 12,
                  padding: "6px 12px", borderRadius: "var(--studio-r-md)",
                  background: "rgba(0,0,0,0.6)", color: "white", backdropFilter: "blur(4px)",
                  fontSize: "0.75rem", fontWeight: 500, border: "1px solid rgba(255,255,255,0.2)", cursor: "pointer",
                  transition: "background 0.2s"
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(0,0,0,0.8)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(0,0,0,0.6)")}
                >
                  Change / Remove
                </button>
              </div>
            )}
          </div>

          {/* Title Area */}
          <textarea
            ref={titleRef}
            value={title}
            onChange={handleTitleChange}
            placeholder="Project Title..."
            className="cms-editor-title"
            rows={1}
            style={{ 
              marginBottom: "1rem", 
              overflow: "hidden", 
              fontSize: "2.75rem", 
              fontWeight: 800,
              color: "var(--studio-text-1)",
              letterSpacing: "-0.02em",
              width: "100%", border: "none", background: "transparent", outline: "none", resize: "none",
            }}
          />

          {/* Excerpt Area */}
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Brief overview of the project..."
            style={{
              width: "100%", border: "none", background: "transparent", outline: "none", resize: "none",
              fontSize: "1.25rem", color: "var(--studio-text-2)", fontWeight: 400, lineHeight: 1.6,
              marginBottom: "2rem", fontFamily: "var(--font-sans)",
            }}
            rows={2}
          />

          {/* Challenges Area */}
          <div style={{ marginBottom: "3rem" }}>
            <h3 style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--studio-text-1)", marginBottom: "1rem" }}>Engineering Challenges</h3>
            <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
              <input
                type="text"
                value={newChallenge}
                onChange={(e) => setNewChallenge(e.target.value)}
                placeholder="Describe a technical challenge..."
                className="cms-input"
                style={{ flex: 1, padding: "10px 14px", fontSize: "0.875rem" }}
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addChallenge(); } }}
              />
              <button type="button" onClick={addChallenge} className="cms-btn" style={{ padding: "0 20px", background: "var(--studio-surface-subtle)", border: "1px solid var(--studio-border)", color: "var(--studio-text-1)" }}>Add</button>
            </div>
            {challenges.length > 0 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {challenges.map((challenge, idx) => (
                  <div key={idx} style={{
                    display: "flex", alignItems: "flex-start", gap: 12,
                    padding: "12px 16px", borderRadius: "var(--studio-r-md)",
                    background: "var(--studio-surface-subtle)", border: "1px solid var(--studio-border)",
                    fontSize: "0.875rem", color: "var(--studio-text-1)", fontWeight: 400,
                  }}>
                    <span style={{ color: "var(--studio-text-3)", fontWeight: 600, flexShrink: 0 }}>{idx + 1}</span>
                    <span style={{ flex: 1, lineHeight: 1.5 }}>{challenge}</span>
                    <button
                      type="button"
                      onClick={() => removeChallenge(idx)}
                      style={{ color: "var(--studio-text-3)", cursor: "pointer", border: "none", background: "none", flexShrink: 0 }}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Content Block Tabs */}
          <div style={{ display: "flex", gap: 8, marginBottom: "1.5rem", borderBottom: "1px solid var(--studio-border)", paddingBottom: "1rem" }}>
            {CONTENT_BLOCKS.map((block) => (
              <button
                key={block.key}
                type="button"
                onClick={() => setActiveContentBlock(block.key)}
                style={{
                  padding: "8px 16px",
                  fontSize: "0.8125rem",
                  fontWeight: activeContentBlock === block.key ? 600 : 500,
                  borderRadius: "var(--studio-r-full)",
                  background: activeContentBlock === block.key ? "var(--studio-text-1)" : "transparent",
                  color: activeContentBlock === block.key ? "var(--studio-surface)" : "var(--studio-text-2)",
                  border: activeContentBlock === block.key ? "none" : "1px solid var(--studio-border)",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
              >
                {block.label}
              </button>
            ))}
          </div>

          {/* WYSIWYG Editor Area */}
          <div style={{ minHeight: "50vh" }}>
            <BlockEditor 
              markdown={getActiveText()} 
              onChange={handleTextChange} 
              slug={slug} 
            />
          </div>
        </div>
      </div>

      {/* ── Publishing Sidebar (25%) ────────────────────────────── */}
      <div style={{ 
        width: 340, 
        flexShrink: 0, 
        borderLeft: "1px solid var(--studio-border)",
        background: "var(--studio-surface-subtle)",
        padding: "2rem 1.5rem",
        position: "sticky",
        top: "0",
        height: "100vh",
        overflowY: "auto",
        display: "flex",
        flexDirection: "column",
        gap: "1.5rem"
      }} className="no-scrollbar">
        
        {/* Actions Panel */}
        <div style={{ background: "var(--studio-surface)", border: "1px solid var(--studio-border)", borderRadius: "var(--studio-r-lg)", padding: "1.25rem", boxShadow: "var(--studio-shadow-sm)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
            <h3 style={{ fontSize: "0.8125rem", fontWeight: 600, color: "var(--studio-text-1)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Publishing</h3>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <button 
              onClick={handleSave}
              disabled={saveLoading}
              className="cms-btn"
              style={{ width: "100%", justifyContent: "center", padding: "10px", fontSize: "0.8125rem", background: "var(--studio-text-1)", color: "var(--studio-surface)", border: "none" }}
            >
              {saveLoading ? "Saving..." : project ? "Update Project" : "Publish Project"}
            </button>

            {lastSaved && (
              <p style={{ fontSize: "0.6875rem", color: "var(--studio-text-3)", textAlign: "center", marginTop: 8 }}>
                Last saved at {lastSaved}
              </p>
            )}
          </div>
        </div>

        {/* Organization Panel */}
        <div style={{ background: "var(--studio-surface)", border: "1px solid var(--studio-border)", borderRadius: "var(--studio-r-lg)", padding: "1.25rem", boxShadow: "var(--studio-shadow-sm)" }}>
          <h3 style={{ fontSize: "0.8125rem", fontWeight: 600, color: "var(--studio-text-1)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "1rem" }}>Organization</h3>
          
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 500, color: "var(--studio-text-2)", marginBottom: 6 }}>
                URL Slug
              </label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(generateSlug(e.target.value))}
                className="cms-input"
                style={{ fontFamily: "var(--font-mono)", fontSize: "0.8125rem", padding: "8px 12px" }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 500, color: "var(--studio-text-2)", marginBottom: 6 }}>
                Category
              </label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="e.g. Backend Engineering"
                className="cms-input"
                style={{ padding: "8px 12px", fontSize: "0.8125rem" }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 500, color: "var(--studio-text-2)", marginBottom: 6 }}>
                Tech Stack
              </label>
              <input
                type="text"
                value={techStackInput}
                onChange={(e) => setTechStackInput(e.target.value)}
                placeholder="Next.js, Node.js, Redis..."
                className="cms-input"
                style={{ padding: "8px 12px", fontSize: "0.8125rem" }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 500, color: "var(--studio-text-2)", marginBottom: 6 }}>
                GitHub URL
              </label>
              <input
                type="url"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                placeholder="https://github.com/..."
                className="cms-input"
                style={{ padding: "8px 12px", fontSize: "0.8125rem" }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 500, color: "var(--studio-text-2)", marginBottom: 6 }}>
                Live URL
              </label>
              <input
                type="url"
                value={liveUrl}
                onChange={(e) => setLiveUrl(e.target.value)}
                placeholder="https://example.com"
                className="cms-input"
                style={{ padding: "8px 12px", fontSize: "0.8125rem" }}
              />
            </div>

            <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "0.8125rem", color: "var(--studio-text-2)", cursor: "pointer", marginTop: "4px" }}>
              <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} style={{ borderRadius: 4 }} />
              Feature on homepage
            </label>
          </div>
        </div>

      </div>
    </div>
  );
}

export default ProjectEditor;
