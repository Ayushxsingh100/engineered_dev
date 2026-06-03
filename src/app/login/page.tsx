"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState } from "react";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { auth, db, isFirebaseConfigured } from "@/lib/firebaseConfig";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const checkUserAccess = async (uid: string, userEmail: string): Promise<boolean> => {
    if (!db) return false;
    const userDoc = await getDoc(doc(db, "users", uid));
    if (userDoc.exists()) {
      if (userDoc.data().disabled) {
        setError("Your account has been disabled. Contact the site owner.");
        return false;
      }
      return true;
    }
    const inviteDoc = await getDoc(doc(db, "invites", userEmail.toLowerCase()));
    if (inviteDoc.exists()) return true;
    return false;
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!isFirebaseConfigured || !auth) {
      if (process.env.NODE_ENV === "development") {
        if (email === "admin@example.com" && password === "admin123") {
          localStorage.setItem("mock_admin_auth", "true");
          router.push("/admin");
        } else {
          setError("Sandbox login: admin@example.com / admin123");
        }
      } else {
        setError("Authentication service is not configured. Contact the site owner.");
      }
      setLoading(false);
      return;
    }

    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      const hasAccess = await checkUserAccess(cred.user.uid, cred.user.email || "");
      if (!hasAccess) {
        setError("Access denied. You need an invitation from the site owner.");
        await auth.signOut();
        setLoading(false);
        return;
      }
      router.push("/admin");
    } catch (err: any) {
      setError("Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    if (!isFirebaseConfigured || !auth) {
      setError("Use email login for sandbox mode.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const provider = new GoogleAuthProvider();
      const cred = await signInWithPopup(auth, provider);
      const hasAccess = await checkUserAccess(cred.user.uid, cred.user.email || "");
      if (!hasAccess) {
        setError("Access denied. Your Google account doesn't have an invitation.");
        await auth.signOut();
        setLoading(false);
        return;
      }
      router.push("/admin");
    } catch (err: any) {
      if (err.code === "auth/popup-closed-by-user") {
        setError("Sign-in popup was closed.");
      } else {
        setError("Google sign-in failed. Try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "var(--cms-surface-warm)",
      padding: 24,
    }}>
      <div style={{
        width: "100%",
        maxWidth: 380,
        animation: "cms-fade-in 0.5s var(--cms-ease) both",
      }}>
        {/* Brand */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 10,
            background: "var(--accent)",
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            marginBottom: 16,
          }}>
            <span style={{ color: "white", fontSize: "1rem", fontWeight: 800 }}>S</span>
          </div>
          <h1 style={{
            fontSize: "1.375rem",
            fontWeight: 700,
            color: "var(--text-primary)",
            letterSpacing: "-0.02em",
          }}>
            Publishing Studio
          </h1>
          <p style={{
            fontSize: "0.8125rem",
            color: "var(--cms-text-muted)",
            marginTop: 6,
            fontWeight: 400,
          }}>
            Sign in to your workspace
          </p>
        </div>

        {/* Error */}
        {error && (
          <div style={{
            marginBottom: 20,
            padding: "12px 16px",
            borderRadius: 10,
            background: "#fef2f2",
            border: "1px solid #fecaca",
            fontSize: "0.8125rem",
            color: "#dc2626",
            fontWeight: 500,
          }}>
            {error}
          </div>
        )}

        {/* Google */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={loading}
          className="cms-btn cms-btn-ghost"
          style={{
            width: "100%",
            padding: "10px 16px",
            marginBottom: 20,
            fontSize: "0.8125rem",
            fontWeight: 500,
            gap: 10,
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
          </svg>
          Continue with Google
        </button>

        {/* Divider */}
        <div style={{ position: "relative", marginBottom: 20 }}>
          <div style={{ width: "100%", height: 1, background: "var(--cms-border-soft)" }} />
          <span style={{
            position: "absolute", left: "50%", top: "50%",
            transform: "translate(-50%, -50%)",
            padding: "0 12px",
            background: "var(--cms-surface-warm)",
            fontSize: "0.6875rem",
            color: "var(--cms-text-muted)",
          }}>
            or
          </span>
        </div>

        {/* Email Form */}
        <form onSubmit={handleEmailLogin} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <label style={{
              display: "block", fontSize: "0.6875rem", fontWeight: 600,
              color: "var(--cms-text-muted)", marginBottom: 6,
              textTransform: "uppercase", letterSpacing: "0.05em",
            }}>
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              placeholder="you@example.com"
              className="cms-input"
              style={{ padding: "10px 14px" }}
            />
          </div>

          <div>
            <label style={{
              display: "block", fontSize: "0.6875rem", fontWeight: 600,
              color: "var(--cms-text-muted)", marginBottom: 6,
              textTransform: "uppercase", letterSpacing: "0.05em",
            }}>
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              placeholder="••••••••"
              className="cms-input"
              style={{ padding: "10px 14px" }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="cms-btn cms-btn-primary"
            style={{ width: "100%", padding: "10px 16px", marginTop: 4 }}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        {/* Footer */}
        <div style={{ marginTop: 32, textAlign: "center" }}>
          <Link href="/" style={{
            fontSize: "0.75rem",
            color: "var(--cms-text-muted)",
            textDecoration: "none",
            fontWeight: 400,
          }}>
            ← Back to website
          </Link>
        </div>
      </div>
    </div>
  );
}
