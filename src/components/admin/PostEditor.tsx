"use client";
/* eslint-disable @typescript-eslint/no-explicit-any, react-hooks/exhaustive-deps */

import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { uploadImage, getAllCategories, autoSavePost } from "@/lib/firebase";
import { isFirebaseConfigured } from "@/lib/firebaseConfig";
import { useAuth } from "@/contexts/AuthContext";
import { validatePostForPublish } from "@/lib/cms-types";
import type { CmsCategory, PostStatus } from "@/lib/cms-types";
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

interface PostEditorProps {
  post?: any;
  onSave: (slug: string, data: any) => Promise<void>;
}

export function PostEditor({ post, onSave }: PostEditorProps) {
  const { cmsUser, firebaseUser, can } = useAuth();

  // Core fields
  const [title, setTitle] = useState(post?.title || "");
  const [slug, setSlug] = useState(post?.slug || "");
  const [description, setDescription] = useState(post?.description || "");
  const [body, setBody] = useState(post?.body || post?.content || "");
  const [tags, setTags] = useState<string[]>(post?.tags || []);
  const [tagInputValue, setTagInputValue] = useState("");
  const [category, setCategory] = useState(post?.category || "");
  const [coverImageUrl, setCoverImageUrl] = useState(post?.coverImageUrl || post?.image || "");
  const [scheduledAt, setScheduledAt] = useState(post?.scheduledAt ? new Date(post.scheduledAt).toISOString().slice(0, 16) : "");

  // SEO fields
  const [seoTitle, setSeoTitle] = useState(post?.seoTitle || "");
  const [seoDescription, setSeoDescription] = useState(post?.seoDescription || "");

  // Status
  const [status, setStatus] = useState<PostStatus>(post?.status || "draft");

  // UI state
  const [uploading, setUploading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const [cropImageSrc, setCropImageSrc] = useState<string | null>(null);

  // Preview state
  const [showPreview, setShowPreview] = useState(false);
  const [previewHtml, setPreviewHtml] = useState("");
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "tablet" | "mobile">("desktop");

  // Data
  const [categories, setCategories] = useState<CmsCategory[]>([]);

  const autoSaveRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const titleRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const cats = await getAllCategories();
        setCategories(cats);
      } catch (err) {
        console.error("Failed to load editor data:", err);
      }
    }
    loadData();
  }, []);

  const generateSlug = (val: string) =>
    val.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-");

  const handleTitleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setTitle(val);
    if (!post) setSlug(generateSlug(val));
  };

  useEffect(() => {
    if (titleRef.current) {
      titleRef.current.style.height = "auto";
      titleRef.current.style.height = titleRef.current.scrollHeight + "px";
    }
  }, [title]);

  // Auto-save (every 30 seconds if editing an existing post)
  useEffect(() => {
    if (!post || !isFirebaseConfigured || !slug) return;
    if (autoSaveRef.current) clearTimeout(autoSaveRef.current);
    autoSaveRef.current = setTimeout(async () => {
      try {
        await autoSavePost(slug, {
          title, description, body, coverImageUrl, category,
          tags, seoTitle, seoDescription, scheduledAt
        } as any);
        setLastSaved(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
      } catch (err) {
        console.error("Auto-save failed:", err);
      }
    }, 30000);
    return () => { if (autoSaveRef.current) clearTimeout(autoSaveRef.current); };
  }, [title, description, body, coverImageUrl, category, tags, seoTitle, seoDescription, scheduledAt]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("Invalid file type. Please upload an image.");
      return;
    }
    if (!isFirebaseConfigured) { alert("Image uploads disabled in sandbox mode."); return; }
    if (!slug) { alert("Please set a title/slug before uploading a cover image."); return; }
    
    setCropImageSrc(URL.createObjectURL(file));
    e.target.value = ""; // Reset input
  };

  const handleCropComplete = async (croppedFile: File) => {
    setCropImageSrc(null);
    
    // Strict MIME type validation after crop
    if (!["image/jpeg", "image/png", "image/webp"].includes(croppedFile.type)) {
      alert("Invalid cropped image format.");
      return;
    }

    setUploading(true);
    try {
      const path = `posts/${slug.trim()}/cover-${Date.now()}`;
      const url = await uploadImage(croppedFile, path);
      setCoverImageUrl(url);
    } catch (err: any) {
      alert(err.message || "Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const handlePreview = async () => {
    setShowPreview(true);
    setPreviewLoading(true);
    try {
      let token = "";
      if (firebaseUser) {
        token = await firebaseUser.getIdToken();
      }

      const res = await fetch("/api/preview", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ markdown: body || "No content yet..." }),
      });
      const data = await res.json();
      if (data.html) {
        setPreviewHtml(data.html);
      } else {
        setPreviewHtml("<p>Error compiling preview.</p>");
      }
    } catch (err) {
      console.error(err);
      setPreviewHtml("<p>Error compiling preview.</p>");
    } finally {
      setPreviewLoading(false);
    }
  };

  const buildPostData = (overrideStatus?: PostStatus) => {
    return {
      title, description, body, tags, category,
      coverImageUrl,
      seoTitle: seoTitle || title,
      seoDescription: seoDescription || description,
      status: overrideStatus || status,
      scheduledAt: scheduledAt || null,
      authorId: post?.authorId || cmsUser?.uid || "",
      authorName: post?.authorName || cmsUser?.displayName || "",
      authorAvatar: post?.authorAvatar || cmsUser?.avatarUrl || "",
      publishedAt: overrideStatus === "published" && status !== "published" 
        ? new Date().toISOString() 
        : (post?.publishedAt || null),
    };
  };

  const handleSave = async (overrideStatus?: PostStatus) => {
    setError("");
    setSuccessMsg("");
    setSaveLoading(true);

    if (!title.trim() || !slug.trim()) {
      setError("Title and Slug are required.");
      setSaveLoading(false);
      return;
    }

    if (overrideStatus === "published") {
      const data = buildPostData(overrideStatus);
      const validation = validatePostForPublish(data);
      if (!validation.valid) {
        setError("Cannot publish: " + validation.errors.join(", "));
        setSaveLoading(false);
        return;
      }
    }

    try {
      await onSave(slug.trim(), buildPostData(overrideStatus));
      setSuccessMsg(
        overrideStatus === "published" ? "Published successfully!" :
        overrideStatus === "review" ? "Submitted for review." :
        "Draft saved."
      );
      if (overrideStatus) setStatus(overrideStatus);
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err: any) {
      setError(err.message || "Failed to save.");
    } finally {
      setSaveLoading(false);
    }
  };

  const publishValidation = validatePostForPublish(buildPostData("published"));

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
          <Link href="/admin/posts" style={{ 
            fontSize: "0.8125rem", color: "var(--studio-text-3)", textDecoration: "none", 
            display: "inline-flex", alignItems: "center", gap: 6, fontWeight: 500,
            transition: "color 0.15s var(--studio-ease)"
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "var(--studio-text-1)")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "var(--studio-text-3)")}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
            Back to Articles
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
            placeholder="Article Title..."
            className="cms-editor-title"
            rows={1}
            style={{ 
              marginBottom: "1rem", 
              overflow: "hidden", 
              fontSize: "2.75rem", 
              fontWeight: 800,
              color: "var(--studio-text-1)",
              letterSpacing: "-0.02em"
            }}
          />

          {/* Excerpt Area */}
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Write a brief subtitle or excerpt..."
            style={{
              width: "100%", border: "none", background: "transparent", outline: "none", resize: "none",
              fontSize: "1.25rem", color: "var(--studio-text-2)", fontWeight: 400, lineHeight: 1.6,
              marginBottom: "2rem", fontFamily: "var(--font-sans)",
            }}
            rows={2}
          />

          {/* WYSIWYG Editor Area */}
          <div style={{ minHeight: "60vh" }}>
            <BlockEditor 
              markdown={body} 
              onChange={setBody} 
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
            <span className={`cms-pill cms-pill-${status}`}>{status}</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <button 
              onClick={() => handleSave("draft")}
              disabled={saveLoading}
              className="cms-btn"
              style={{ width: "100%", justifyContent: "center", padding: "10px", fontSize: "0.8125rem", background: "var(--studio-surface-subtle)", color: "var(--studio-text-1)", border: "1px solid var(--studio-border)" }}
            >
              {saveLoading ? "Saving..." : "Save Draft"}
            </button>
            
            {can("posts.publish") && (
              <button 
                onClick={() => handleSave(scheduledAt ? "scheduled" : "published")}
                disabled={saveLoading || !publishValidation.valid}
                className="cms-btn"
                style={{ width: "100%", justifyContent: "center", padding: "10px", fontSize: "0.8125rem", background: publishValidation.valid ? "var(--studio-text-1)" : "var(--studio-surface-subtle)", color: publishValidation.valid ? "var(--studio-surface)" : "var(--studio-text-3)", border: "none", opacity: publishValidation.valid ? 1 : 0.6 }}
              >
                {post?.status === "published" ? "Update Article" : scheduledAt ? "Schedule Post" : "Publish Now"}
              </button>
            )}

            <button 
              onClick={handlePreview}
              type="button"
              className="cms-btn"
              style={{ width: "100%", justifyContent: "center", padding: "10px", fontSize: "0.8125rem", background: "transparent", color: "var(--studio-text-2)", border: "1px solid var(--studio-border)", marginTop: 4 }}
            >
              Preview Full Article
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: 4 }}><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
            </button>

            {!publishValidation.valid && (
              <div style={{
                marginTop: 8, padding: "12px", borderRadius: "var(--studio-r-md)",
                background: "var(--studio-amber-bg)", border: "1px solid rgba(245,158,11,0.2)",
                fontSize: "0.75rem", color: "var(--studio-amber)",
              }}>
                <span style={{ fontWeight: 600, display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                  Missing Requirements
                </span>
                <ul style={{ paddingLeft: 20, margin: 0, display: "flex", flexDirection: "column", gap: 4 }}>
                  {publishValidation.errors.map((err, i) => (
                    <li key={i} style={{ lineHeight: 1.4 }}>{err}</li>
                  ))}
                </ul>
              </div>
            )}

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
              <div style={{ position: "relative" }}>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="cms-input"
                  style={{ cursor: "pointer", padding: "8px 12px", appearance: "none", width: "100%", fontSize: "0.8125rem" }}
                >
                  <option value="">Select category...</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.slug}>{c.name}</option>
                  ))}
                </select>
                <div style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "var(--studio-text-3)" }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                </div>
              </div>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 500, color: "var(--studio-text-2)", marginBottom: 6 }}>
                Tags
              </label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: tags.length > 0 ? "8px" : "0" }}>
                {tags.map(tag => (
                  <span key={tag} style={{ display: "inline-flex", alignItems: "center", gap: "4px", background: "var(--studio-surface-subtle)", border: "1px solid var(--studio-border)", padding: "2px 8px", borderRadius: "12px", fontSize: "0.75rem", color: "var(--studio-text-1)", fontWeight: 500 }}>
                    {tag}
                    <button type="button" onClick={() => setTags(tags.filter(t => t !== tag))} style={{ background: "none", border: "none", color: "var(--studio-text-3)", cursor: "pointer", display: "flex", padding: 0 }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>
                  </span>
                ))}
              </div>
              <input
                type="text"
                value={tagInputValue}
                onChange={(e) => setTagInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ',') {
                    e.preventDefault();
                    const val = tagInputValue.trim();
                    if (val && !tags.includes(val)) setTags([...tags, val]);
                    setTagInputValue("");
                  } else if (e.key === 'Backspace' && !tagInputValue && tags.length > 0) {
                    setTags(tags.slice(0, -1));
                  }
                }}
                placeholder="Type a tag and press Enter..."
                className="cms-input"
                style={{ padding: "8px 12px", fontSize: "0.8125rem" }}
              />
            </div>
            
            <div>
              <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 500, color: "var(--studio-text-2)", marginBottom: 6 }}>
                Schedule Post <span style={{ color: "var(--studio-text-3)", fontWeight: 400 }}>(Optional)</span>
              </label>
              <input
                type="datetime-local"
                value={scheduledAt}
                onChange={(e) => setScheduledAt(e.target.value)}
                className="cms-input"
                style={{ padding: "8px 12px", fontSize: "0.8125rem", width: "100%" }}
              />
            </div>
          </div>
        </div>

        {/* SEO Panel */}
        <div style={{ background: "var(--studio-surface)", border: "1px solid var(--studio-border)", borderRadius: "var(--studio-r-lg)", padding: "1.25rem", boxShadow: "var(--studio-shadow-sm)", marginBottom: "2rem" }}>
          <h3 style={{ fontSize: "0.8125rem", fontWeight: 600, color: "var(--studio-text-1)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "1rem" }}>SEO Settings</h3>
          
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 500, color: "var(--studio-text-2)", marginBottom: 6 }}>
                Meta Title
              </label>
              <input
                type="text"
                value={seoTitle}
                onChange={(e) => setSeoTitle(e.target.value)}
                placeholder={title || "Defaults to article title"}
                className="cms-input"
                style={{ padding: "8px 12px", fontSize: "0.8125rem" }}
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 500, color: "var(--studio-text-2)", marginBottom: 6 }}>
                Meta Description
              </label>
              <textarea
                rows={3}
                value={seoDescription}
                onChange={(e) => setSeoDescription(e.target.value)}
                placeholder={description || "Defaults to excerpt"}
                className="cms-input"
                style={{ padding: "8px 12px", fontSize: "0.8125rem", resize: "vertical" }}
              />
            </div>
          </div>
        </div>

      </div>

      {/* ── Live Preview Modal ────────────────────────────── */}
      {showPreview && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 9999,
          background: "var(--background)", overflowY: "auto",
        }} className="cms-fade-in">
          
          <div style={{ position: "sticky", top: 0, background: "var(--background)", backdropFilter: "blur(12px)", zIndex: 10, padding: "1rem 2rem", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottomColor: "var(--border)" }}>
            <span style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--muted-foreground)" }}>
              Live Website Preview (Unsaved Changes Included)
            </span>
            
            <div style={{ display: "flex", gap: "4px", background: "var(--muted)", padding: "4px", borderRadius: "99px", border: "1px solid var(--border)" }}>
              {(["desktop", "tablet", "mobile"] as const).map(device => (
                <button
                  key={device}
                  onClick={() => setPreviewDevice(device)}
                  style={{
                    padding: "4px 12px", borderRadius: "99px", fontSize: "0.75rem", fontWeight: 600, textTransform: "capitalize",
                    background: previewDevice === device ? "var(--background)" : "transparent",
                    color: previewDevice === device ? "var(--foreground)" : "var(--muted-foreground)",
                    boxShadow: previewDevice === device ? "0 1px 2px rgba(0,0,0,0.1)" : "none",
                    border: "none", cursor: "pointer", transition: "all 0.2s"
                  }}
                >
                  {device}
                </button>
              ))}
            </div>

            <button onClick={() => setShowPreview(false)} className="cms-btn cms-btn-primary" style={{ borderRadius: 99, padding: "8px 20px" }}>
              Close Preview
            </button>
          </div>
          
          <div style={{
            margin: "0 auto",
            width: previewDevice === "mobile" ? "375px" : previewDevice === "tablet" ? "768px" : "100%",
            background: "var(--background)",
            minHeight: "100vh",
            transition: "width 0.3s ease",
            borderLeft: previewDevice !== "desktop" ? "1px solid var(--border)" : "none",
            borderRight: previewDevice !== "desktop" ? "1px solid var(--border)" : "none",
            boxShadow: previewDevice !== "desktop" ? "0 25px 50px -12px rgba(0, 0, 0, 0.25)" : "none",
            position: "relative"
          }}>
            <article className="pt-16 sm:pt-24 pb-32 min-h-screen relative z-0">
            {/* Editorial Header */}
            <header className="max-w-[720px] mx-auto px-6 mb-16 text-center">
              <div className="mb-6 flex justify-center">
                <span className="bg-accent/10 border border-accent/20 text-accent text-[11px] font-bold uppercase tracking-widest px-4.5 py-1.5 rounded-full">
                  {(tags[0] || "Editorial").trim()}
                </span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-heading text-foreground tracking-tight leading-tight mb-8 text-balance">
                {title || "Untitled Article"}
              </h1>
              {description && (
                <p className="text-lg text-muted-foreground leading-relaxed max-w-[600px] mx-auto mb-10 text-pretty font-semibold">
                  {description}
                </p>
              )}
              <div className="flex flex-wrap items-center justify-center gap-y-4 gap-x-6 text-[13px] text-text-secondary pt-8 border-t border-accent/10 max-w-[500px] mx-auto">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center font-bold text-accent shadow-inner text-[12px]">
                    {cmsUser?.displayName ? cmsUser.displayName[0] : "A"}
                  </div>
                  <span className="font-bold text-text-primary">
                    By {cmsUser?.displayName || "Author"}
                  </span>
                </div>
                <span className="text-accent/30 hidden sm:inline">·</span>
                <div className="flex items-center gap-1.5 font-semibold">
                  <svg className="w-4 h-4 text-accent/70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                  </svg>
                  <time>Just now</time>
                </div>
              </div>
            </header>

            {/* Hero Image */}
            {coverImageUrl && (
              <div className="max-w-6xl mx-auto px-6 mb-20 w-full">
                <div className="aspect-[21/9] w-full relative bg-muted rounded-[2rem] overflow-hidden border border-border/50 shadow-sm">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={coverImageUrl} alt="Cover" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
              </div>
            )}

            {/* Prose Content */}
            <div className="max-w-[720px] mx-auto px-6">
              {previewLoading ? (
                <div style={{ padding: "4rem", textAlign: "center", color: "var(--cms-text-muted)" }}>
                  Compiling markdown...
                </div>
              ) : (
                <div className="prose w-full max-w-none" dangerouslySetInnerHTML={{ __html: previewHtml }} />
              )}
            </div>
          </article>
        </div>
        </div>
      )}

    </div>
  );
}

export default PostEditor;
