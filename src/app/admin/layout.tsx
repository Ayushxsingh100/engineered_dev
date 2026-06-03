"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { AdminCommandPalette } from "@/components/AdminCommandPalette";
import { motion } from "framer-motion";

/* ── SVG Icon Components ────────────────────────────────────────────────── */
const Icons = {
  home: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  ),
  pen: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
    </svg>
  ),
  cube: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
      <line x1="12" y1="22.08" x2="12" y2="12" />
    </svg>
  ),
  users: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  tag: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
      <line x1="7" y1="7" x2="7.01" y2="7" />
    </svg>
  ),
  external: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  ),
  logout: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  ),
};

function AdminLayoutInner({ children }: { children: React.ReactNode }) {
  const { cmsUser, role, loading, error, signOut, can } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    if (!loading && !cmsUser) {
      router.push("/login");
    }
  }, [loading, cmsUser, router]);

  if (loading) {
    return (
      <div className="cms-shell items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-accent cms-saving" />
          <span style={{ fontSize: "0.75rem", fontWeight: 500, color: "var(--cms-text-muted)", letterSpacing: "0.05em" }}>
            Loading...
          </span>
        </div>
      </div>
    );
  }

  if (error || !cmsUser) {
    return (
      <div className="cms-shell items-center justify-center">
        <div style={{ textAlign: "center", maxWidth: 360 }}>
          <p style={{ fontSize: "0.875rem", color: "#ef4444", fontWeight: 500, marginBottom: 16 }}>
            {error || "Access denied."}
          </p>
          <button
            onClick={() => { signOut(); router.push("/login"); }}
            className="cms-btn cms-btn-ghost"
          >
            Return to login
          </button>
        </div>
      </div>
    );
  }

  const ROLE_STYLES: Record<string, string> = {
    owner: "cms-pill" + " " + "cms-pill-published",
    admin: "cms-pill" + " " + "cms-pill-scheduled",
    author: "cms-pill" + " " + "cms-pill-draft",
  };

  const sidebarLinks = [
    { href: "/admin", label: "Dashboard", icon: Icons.home },
    { href: "/admin/posts", label: "Articles", icon: Icons.pen },
    { href: "/admin/projects", label: "Projects", icon: Icons.cube },
    ...(can("categories.manage")
      ? [{ href: "/admin/categories", label: "Categories", icon: Icons.tag }]
      : []),
    ...(can("users.manage")
      ? [{ href: "/admin/users", label: "Authors", icon: Icons.users }]
      : []),
  ];

  const isActive = (href: string) =>
    pathname === href || (href !== "/admin" && pathname.startsWith(href + "/"));

  const handleLogout = async () => {
    await signOut();
    router.push("/login");
  };

  return (
    <div className="cms-shell">
      <AdminCommandPalette />
      {/* ── Studio Sidebar ──────────────────────────────────────────────── */}
      <aside className="cms-sidebar hidden md:flex" style={{ flexDirection: "column", justifyContent: "space-between", borderRight: "1px solid var(--studio-border)" }}>
        {/* Top section */}
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {/* Brand */}
          <Link
            href="/admin"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "20px 16px 16px",
              textDecoration: "none",
              borderBottom: "1px solid var(--studio-border)",
              marginBottom: 8,
            }}
          >
            <div style={{
              width: 28,
              height: 28,
              borderRadius: 6,
              background: "var(--studio-accent)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--studio-surface)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
              </svg>
            </div>
            <div>
              <p style={{ fontSize: "0.875rem", fontWeight: 700, color: "var(--studio-text-1)", letterSpacing: "-0.01em", lineHeight: 1.2 }}>
                Admin Dashboard
              </p>
              <p style={{ fontSize: "0.6875rem", color: "var(--studio-text-3)", marginTop: 1 }}>
                Content Management
              </p>
            </div>
          </Link>

          {/* Write CTA */}
          <div style={{ padding: "8px 12px" }}>
            <Link href="/admin/posts/new" className="studio-write-btn" style={{ margin: 0, width: "100%", boxSizing: "border-box", background: "var(--studio-text-1)", color: "var(--studio-surface)" }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              New Article
            </Link>
          </div>

          {/* Nav */}
          <nav style={{ padding: "8px 12px", display: "flex", flexDirection: "column", gap: 2 }}>
            <span className="studio-sidebar-group-label" style={{ display: "block", marginTop: 8 }}>Workspace</span>
            <Link href="/admin" className={`cms-nav-item${isActive("/admin") ? " active" : ""}`}>
              <span className="cms-nav-icon">{Icons.home}</span>
              <span>Overview</span>
            </Link>
            <Link href="/admin/posts" className={`cms-nav-item${isActive("/admin/posts") ? " active" : ""}`}>
              <span className="cms-nav-icon">{Icons.pen}</span>
              <span>Articles</span>
            </Link>
            <Link href="/admin/projects" className={`cms-nav-item${isActive("/admin/projects") ? " active" : ""}`}>
              <span className="cms-nav-icon">{Icons.cube}</span>
              <span>Case Studies</span>
            </Link>

            {can("categories.manage") && (
              <>
                <span className="studio-sidebar-group-label">Manage</span>
                <Link href="/admin/categories" className={`cms-nav-item${isActive("/admin/categories") ? " active" : ""}`}>
                  <span className="cms-nav-icon">{Icons.tag}</span>
                  <span>Categories</span>
                </Link>
              </>
            )}
            {can("users.manage") && (
              <Link href="/admin/users" className={`cms-nav-item${isActive("/admin/users") ? " active" : ""}`}>
                <span className="cms-nav-icon">{Icons.users}</span>
                <span>Authors</span>
              </Link>
            )}
          </nav>
        </div>

        {/* Bottom: User + View site */}
        <div style={{ padding: "12px", borderTop: "1px solid var(--studio-border)" }}>
          <Link href="/" target="_blank" className="cms-nav-item" style={{ marginBottom: 4 }}>
            <span className="cms-nav-icon">{Icons.external}</span>
            <span>View site</span>
          </Link>

          {/* User row */}
          <div style={{ position: "relative" }}>
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "8px 10px",
                borderRadius: 8,
                border: "1px solid transparent",
                background: "transparent",
                cursor: "pointer",
                textAlign: "left",
                transition: "all 0.15s",
              }}
              onMouseEnter={e => { e.currentTarget.style.background = "var(--studio-surface-subtle)"; e.currentTarget.style.borderColor = "var(--studio-border)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "transparent"; }}
            >
              {cmsUser.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={cmsUser.avatarUrl} alt="" style={{ width: 28, height: 28, borderRadius: "50%", objectFit: "cover", flexShrink: 0, border: "1px solid var(--studio-border)" }} />
              ) : (
                <div 
                  style={{ width: 28, height: 28, borderRadius: "50%", background: "var(--studio-accent)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem", fontWeight: 700, flexShrink: 0 }}
                >
                  {cmsUser.displayName?.charAt(0)?.toUpperCase() || "?"}
                </div>
              )}
              <div style={{ minWidth: 0, overflow: "hidden", flex: 1 }}>
                <p style={{ fontSize: "0.8125rem", fontWeight: 600, color: "var(--studio-text-1)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", lineHeight: 1.3 }}>
                  {cmsUser.displayName}
                </p>
                <span className={ROLE_STYLES[role || "author"]} style={{ fontSize: "0.5625rem", marginTop: 2, display: "inline-block" }}>
                  {role}
                </span>
              </div>
            </button>

            {showUserMenu && (
              <>
                <div style={{ position: "fixed", inset: 0, zIndex: 45 }} onClick={() => setShowUserMenu(false)} />
                <div className="cms-card" style={{ position: "absolute", bottom: "calc(100% + 8px)", left: 0, right: 0, padding: 6, zIndex: 50 }}>
                  <div style={{ padding: "8px 10px", borderBottom: "1px solid var(--studio-border)", marginBottom: 4 }}>
                    <p style={{ fontSize: "0.8125rem", fontWeight: 600, color: "var(--studio-text-1)" }}>{cmsUser.displayName}</p>
                    <p style={{ fontSize: "0.6875rem", color: "var(--studio-text-3)", marginTop: 2 }}>{cmsUser.email}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", padding: "8px 10px", border: "none", background: "transparent", color: "var(--studio-red)", fontSize: "0.8125rem", textAlign: "left", cursor: "pointer", borderRadius: 6, fontWeight: 500, fontFamily: "inherit" }}
                    onMouseEnter={e => (e.currentTarget.style.background = "var(--studio-red-bg)")}
                    onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                  >
                    <span style={{ opacity: 0.8 }}>{Icons.logout}</span>
                    Sign out
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </aside>

      {/* ── Main Content ──────────────────────────────────────────────────── */}
      <main className="cms-main">
        <div className="cms-content">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", damping: 24, stiffness: 200 }}
          >
            {children}
          </motion.div>
        </div>

      </main>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AdminLayoutInner>{children}</AdminLayoutInner>
    </AuthProvider>
  );
}
