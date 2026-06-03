"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState } from "react";
import { getAllUsers, inviteUser, updateUserRole, disableUser, deleteUser } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";
import { isFirebaseConfigured } from "@/lib/firebaseConfig";
import type { CmsUser, UserRole } from "@/lib/cms-types";

export default function UsersPage() {
  const { can, cmsUser } = useAuth();
  const [users, setUsers] = useState<CmsUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<UserRole>("author");
  const [inviting, setInviting] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const loadUsers = async () => {
    try {
      const all = await getAllUsers();
      setUsers(all);
    } catch (err) {
      console.error("Failed to load users:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadUsers(); }, []);

  const handleInvite = async () => {
    if (!inviteEmail.trim()) return;
    if (!isFirebaseConfigured) { alert("Disabled in sandbox."); return; }
    setInviting(true);
    try {
      await inviteUser(inviteEmail.trim(), inviteRole, cmsUser?.uid || "");
      setInviteEmail("");
      alert(`Invitation sent to ${inviteEmail}.`);
    } catch (err) {
      alert("Failed to send invite.");
    } finally {
      setInviting(false);
    }
  };

  const handleRoleChange = async (uid: string, newRole: UserRole) => {
    setActionLoading(uid);
    try {
      await updateUserRole(uid, newRole);
      await loadUsers();
    } catch (err) {
      alert("Failed to update role.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleToggleDisable = async (uid: string, currentlyDisabled: boolean) => {
    setActionLoading(uid);
    try {
      await disableUser(uid, !currentlyDisabled);
      await loadUsers();
    } catch (err) {
      alert("Failed to update status.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (uid: string) => {
    if (!confirm("Remove this author permanently?")) return;
    try {
      await deleteUser(uid);
      await loadUsers();
    } catch (err) {
      alert("Failed to delete.");
    }
  };

  if (!can("users.manage")) {
    return (
      <div className="cms-empty">
        <p>Only the site owner can manage authors.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "6rem 0" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--studio-accent)" }} className="cms-saving" />
          <span style={{ fontSize: "0.875rem", color: "var(--studio-text-3)" }}>Loading team…</span>
        </div>
      </div>
    );
  }

  return (
    <div className="cms-animate-in" style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      <div>
        <h1 style={{ fontSize: "1.5rem", fontWeight: 700, letterSpacing: "-0.02em", color: "var(--studio-text-1)", lineHeight: 1.2 }}>
          Authors
        </h1>
        <p style={{ fontSize: "0.875rem", color: "var(--studio-text-3)", marginTop: 4 }}>Manage your writing team</p>
      </div>

      {/* Invite */}
      <div className="cms-card" style={{ padding: "1.25rem" }}>
        <h2 className="cms-section-title" style={{ marginBottom: 12 }}>Invite Author</h2>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <input
            type="email"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            placeholder="colleague@company.com"
            className="cms-input"
            style={{ flex: 1, minWidth: 200 }}
          />
          <select
            value={inviteRole}
            onChange={(e) => setInviteRole(e.target.value as UserRole)}
            className="cms-input"
            style={{ width: 120, cursor: "pointer" }}
          >
            <option value="author">Author</option>
            <option value="admin">Admin</option>
          </select>
          <button
            onClick={handleInvite}
            disabled={inviting || !inviteEmail.trim()}
            className="cms-btn cms-btn-accent"
          >
            {inviting ? "Inviting..." : "Send Invite"}
          </button>
        </div>
      </div>

      {/* Author Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 12 }}>
        {users.map((user) => {
          const isSelf = user.uid === cmsUser?.uid;
          return (
            <div key={user.uid} className="cms-card" style={{ padding: "1.25rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                {user.avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={user.avatarUrl} alt="" style={{
                    width: 40, height: 40, borderRadius: "50%", objectFit: "cover",
                    border: "2px solid var(--cms-border-soft)", flexShrink: 0,
                  }} />
                ) : (
                  <div style={{
                    width: 40, height: 40, borderRadius: "50%",
                    background: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center",
                    color: "white", fontSize: "0.875rem", fontWeight: 700, flexShrink: 0,
                  }}>
                    {user.displayName?.charAt(0)?.toUpperCase() || "?"}
                  </div>
                )}
                <div style={{ minWidth: 0, flex: 1 }}>
                  <p style={{
                    fontSize: "0.875rem", fontWeight: 600, color: "var(--text-primary)",
                    overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                  }}>
                    {user.displayName}
                    {isSelf && <span style={{ fontSize: "0.625rem", color: "var(--accent)", marginLeft: 6 }}>(you)</span>}
                  </p>
                  <p style={{ fontSize: "0.6875rem", color: "var(--cms-text-muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {user.email}
                  </p>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                {isSelf || user.role === "owner" ? (
                  <span className={`cms-pill cms-pill-${user.role === "owner" ? "published" : user.role === "admin" ? "scheduled" : "draft"}`}>
                    {user.role}
                  </span>
                ) : (
                  <select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user.uid, e.target.value as UserRole)}
                    disabled={actionLoading === user.uid}
                    className="cms-input"
                    style={{ width: 100, fontSize: "0.75rem", padding: "4px 8px", cursor: "pointer" }}
                  >
                    <option value="author">Author</option>
                    <option value="admin">Admin</option>
                  </select>
                )}

                {!isSelf && user.role !== "owner" && (
                  <div style={{ display: "flex", gap: 6 }}>
                    <button
                      onClick={() => handleToggleDisable(user.uid, user.disabled)}
                      disabled={actionLoading === user.uid}
                      style={{
                        fontSize: "0.6875rem", fontWeight: 500, cursor: "pointer",
                        border: "none", background: "none", padding: "4px 8px", borderRadius: 4,
                        color: user.disabled ? "#16a34a" : "#d97706",
                      }}
                    >
                      {user.disabled ? "Enable" : "Disable"}
                    </button>
                    <button
                      onClick={() => handleDelete(user.uid)}
                      style={{
                        fontSize: "0.6875rem", fontWeight: 500, cursor: "pointer",
                        border: "none", background: "none", padding: "4px 8px", borderRadius: 4,
                        color: "#ef4444",
                      }}
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>

              {user.disabled && (
                <div style={{
                  marginTop: 12, padding: "6px 10px", borderRadius: 6,
                  background: "#fef2f2", fontSize: "0.625rem", color: "#dc2626", fontWeight: 500,
                }}>
                  Account disabled
                </div>
              )}
            </div>
          );
        })}
      </div>

      {users.length === 0 && (
        <div className="cms-empty">
          <p>No team members yet. Send an invite to get started.</p>
        </div>
      )}
    </div>
  );
}
