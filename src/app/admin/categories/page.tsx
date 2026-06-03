"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState } from "react";
import { getAllCategories, createCategory, updateCategory, deleteCategory } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";
import type { CmsCategory } from "@/lib/cms-types";
import { isFirebaseConfigured } from "@/lib/firebaseConfig";

export default function CategoriesPage() {
  const { can } = useAuth();
  const [categories, setCategories] = useState<CmsCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [newName, setNewName] = useState("");
  const [newSlug, setNewSlug] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [creating, setCreating] = useState(false);

  const [editName, setEditName] = useState("");
  const [editSlug, setEditSlug] = useState("");
  const [editDesc, setEditDesc] = useState("");

  const loadCategories = async () => {
    try {
      const cats = await getAllCategories();
      setCategories(cats);
    } catch (err) {
      console.error("Failed to load categories:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadCategories(); }, []);

  const generateSlug = (val: string) =>
    val.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-");

  const handleCreate = async () => {
    if (!newName.trim() || !newSlug.trim()) return;
    if (!isFirebaseConfigured) { alert("Disabled in sandbox."); return; }
    setCreating(true);
    try {
      await createCategory({ name: newName.trim(), slug: newSlug.trim(), description: newDesc.trim(), order: categories.length });
      setNewName(""); setNewSlug(""); setNewDesc("");
      await loadCategories();
    } catch (err) {
      alert("Failed to create category.");
    } finally {
      setCreating(false);
    }
  };

  const handleEdit = (cat: CmsCategory) => {
    setEditingId(cat.id);
    setEditName(cat.name);
    setEditSlug(cat.slug);
    setEditDesc(cat.description);
  };

  const handleSaveEdit = async () => {
    if (!editingId) return;
    try {
      await updateCategory(editingId, { name: editName.trim(), slug: editSlug.trim(), description: editDesc.trim() });
      setEditingId(null);
      await loadCategories();
    } catch (err) {
      alert("Failed to update.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this category?")) return;
    try {
      await deleteCategory(id);
      await loadCategories();
    } catch (err) {
      alert("Failed to delete.");
    }
  };

  if (!can("categories.manage")) {
    return (
      <div className="cms-empty">
        <p>You don&apos;t have permission to manage categories.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "4rem 0" }}>
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-accent cms-saving" />
          <span style={{ fontSize: "0.8125rem", color: "var(--cms-text-muted)" }}>Loading categories...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="cms-animate-in" style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      <div>
        <h1 style={{ fontSize: "1.5rem", fontWeight: 700, letterSpacing: "-0.02em", color: "var(--studio-text-1)", lineHeight: 1.2 }}>
          Categories
        </h1>
        <p style={{ fontSize: "0.875rem", color: "var(--studio-text-3)", marginTop: 4 }}>Organize your content</p>
      </div>

      {/* Create */}
      <div className="cms-card" style={{ padding: "1.25rem" }}>
        <h2 className="cms-section-title" style={{ marginBottom: 12 }}>Add Category</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <input
              type="text"
              value={newName}
              onChange={(e) => { setNewName(e.target.value); setNewSlug(generateSlug(e.target.value)); }}
              placeholder="Category name"
              className="cms-input"
              style={{ flex: 1, minWidth: 160 }}
            />
            <input
              type="text"
              value={newSlug}
              onChange={(e) => setNewSlug(generateSlug(e.target.value))}
              placeholder="slug"
              className="cms-input"
              style={{ width: 140, fontFamily: "var(--font-mono)", fontSize: "0.75rem" }}
            />
          </div>
          <input
            type="text"
            value={newDesc}
            onChange={(e) => setNewDesc(e.target.value)}
            placeholder="Description (optional)"
            className="cms-input"
          />
          <button
            onClick={handleCreate}
            disabled={creating || !newName.trim()}
            className="cms-btn cms-btn-accent"
            style={{ alignSelf: "flex-start" }}
          >
            {creating ? "Creating..." : "Create"}
          </button>
        </div>
      </div>

      {/* Category List */}
      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {categories.map((cat) => (
          <div key={cat.id} className="cms-card" style={{
            padding: "14px 18px",
            borderRadius: "var(--cms-radius)",
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}>
            {editingId === cat.id ? (
              <div style={{ display: "flex", flex: 1, gap: 8, flexWrap: "wrap", alignItems: "center" }}>
                <input
                  type="text" value={editName} onChange={(e) => setEditName(e.target.value)}
                  className="cms-input" style={{ flex: 1, minWidth: 120 }}
                />
                <input
                  type="text" value={editSlug} onChange={(e) => setEditSlug(generateSlug(e.target.value))}
                  className="cms-input" style={{ width: 120, fontFamily: "var(--font-mono)", fontSize: "0.75rem" }}
                />
                <button onClick={handleSaveEdit} className="cms-btn cms-btn-accent" style={{ fontSize: "0.75rem" }}>Save</button>
                <button onClick={() => setEditingId(null)} className="cms-btn cms-btn-ghost" style={{ fontSize: "0.75rem" }}>Cancel</button>
              </div>
            ) : (
              <>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--text-primary)" }}>{cat.name}</p>
                  <p style={{ fontSize: "0.6875rem", color: "var(--cms-text-muted)", fontFamily: "var(--font-mono)" }}>/{cat.slug}</p>
                </div>
                <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                  <button onClick={() => handleEdit(cat)} style={{
                    fontSize: "0.6875rem", fontWeight: 500, cursor: "pointer",
                    border: "none", background: "none", color: "var(--text-secondary)", padding: "4px 8px", borderRadius: 4,
                  }}>
                    Edit
                  </button>
                  <button onClick={() => handleDelete(cat.id)} style={{
                    fontSize: "0.6875rem", fontWeight: 500, cursor: "pointer",
                    border: "none", background: "none", color: "#ef4444", padding: "4px 8px", borderRadius: 4,
                  }}>
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
        {categories.length === 0 && (
          <div className="cms-empty">
            <p>No categories yet. Create one above to organize your articles.</p>
          </div>
        )}
      </div>
    </div>
  );
}
