"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { onAuthStateChanged, signOut as firebaseSignOut, User } from "firebase/auth";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { auth, db, isFirebaseConfigured } from "@/lib/firebaseConfig";
import type { CmsUser, UserRole, CmsPermission } from "@/lib/cms-types";
import { hasPermission } from "@/lib/cms-types";

/* -------------------------------------------------------------------------- */
/*  Context Shape                                                             */
/* -------------------------------------------------------------------------- */

interface AuthContextValue {
  firebaseUser: User | null;
  cmsUser: CmsUser | null;
  role: UserRole | null;
  loading: boolean;
  error: string | null;
  signOut: () => Promise<void>;
  can: (permission: CmsPermission) => boolean;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  firebaseUser: null,
  cmsUser: null,
  role: null,
  loading: true,
  error: null,
  signOut: async () => {},
  can: () => false,
  refresh: async () => {},
});

export const useAuth = () => useContext(AuthContext);

/* -------------------------------------------------------------------------- */
/*  Provider                                                                  */
/* -------------------------------------------------------------------------- */

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [cmsUser, setCmsUser] = useState<CmsUser | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCmsUser = useCallback(async (fbUser: User) => {
    if (!db) return null;

    // 1. Check users/{uid} for existing user
    const userDoc = await getDoc(doc(db, "users", fbUser.uid));
    if (userDoc.exists()) {
      const data = userDoc.data();
      return {
        uid: fbUser.uid,
        email: fbUser.email || "",
        displayName: data.displayName || fbUser.displayName || "",
        avatarUrl: data.avatarUrl || fbUser.photoURL || "",
        bio: data.bio || "",
        role: data.role as UserRole,
        socialLinks: data.socialLinks || {},
        createdAt: data.createdAt?.toDate?.()?.toISOString?.() || new Date().toISOString(),
        updatedAt: data.updatedAt?.toDate?.()?.toISOString?.() || new Date().toISOString(),
        disabled: !!data.disabled,
      } as CmsUser;
    }

    // 2. Check invites/{email} for pending invitation
    const email = fbUser.email?.toLowerCase();
    if (email) {
      const inviteDocRef = doc(db, "invites", email);
      const inviteSnap = await getDoc(inviteDocRef);
      
      if (inviteSnap.exists()) {
        const inviteData = inviteSnap.data();
        // Activate the invite: create user doc
        const { setDoc, Timestamp, deleteDoc } = await import("firebase/firestore");
        const newUser: any = {
          email: fbUser.email, // preserve original casing for display
          displayName: fbUser.displayName || email.split("@")[0],
          avatarUrl: fbUser.photoURL || "",
          bio: "",
          role: inviteData.role || "author",
          socialLinks: {},
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
          disabled: false,
        };
        await setDoc(doc(db, "users", fbUser.uid), newUser);
        // Clean up the invite
        await deleteDoc(inviteDocRef);
        return {
          uid: fbUser.uid,
          email,
          displayName: newUser.displayName,
          avatarUrl: newUser.avatarUrl,
          bio: "",
          role: newUser.role as UserRole,
          socialLinks: {},
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          disabled: false,
        } as CmsUser;
      }
    }

    return null; // No user doc and no invite — access denied
  }, []);

  const refresh = useCallback(async () => {
    if (firebaseUser) {
      try {
        const user = await fetchCmsUser(firebaseUser);
        if (user) {
          setCmsUser(user);
          setRole(user.role);
          setError(null);
        }
      } catch (err) {
        console.error("Failed to refresh user:", err);
      }
    }
  }, [firebaseUser, fetchCmsUser]);

  useEffect(() => {
    // Sandbox bypass — DEVELOPMENT ONLY
    if (!isFirebaseConfigured || !auth) {
      if (process.env.NODE_ENV === "development") {
        const mockAuth = typeof window !== "undefined" && localStorage.getItem("mock_admin_auth");
        if (mockAuth === "true") {
          setCmsUser({
            uid: "sandbox",
            email: "admin@example.com",
            displayName: "Sandbox Admin",
            avatarUrl: "",
            bio: "Local development admin",
            role: "owner",
            socialLinks: {},
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            disabled: false,
          });
          setRole("owner");
        }
      }
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setFirebaseUser(fbUser);

      if (!fbUser) {
        setCmsUser(null);
        setRole(null);
        setLoading(false);
        return;
      }

      try {
        const user = await fetchCmsUser(fbUser);
        if (user) {
          if (user.disabled) {
            setError("Your account has been disabled. Contact the site owner.");
            setCmsUser(null);
            setRole(null);
          } else {
            setCmsUser(user);
            setRole(user.role);
            setError(null);
          }
        } else {
          setError("Access denied. You need an invitation to access the admin panel.");
          setCmsUser(null);
          setRole(null);
        }
      } catch (err: any) {
        console.error("Auth context error:", err);
        setError("Failed to load user profile.");
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [fetchCmsUser]);

  const handleSignOut = async () => {
    if (!isFirebaseConfigured || !auth) {
      localStorage.removeItem("mock_admin_auth");
      setCmsUser(null);
      setRole(null);
      return;
    }
    await firebaseSignOut(auth);
    setCmsUser(null);
    setRole(null);
  };

  const can = useCallback(
    (permission: CmsPermission) => hasPermission(role, permission),
    [role]
  );

  return (
    <AuthContext.Provider
      value={{ firebaseUser, cmsUser, role, loading, error, signOut: handleSignOut, can, refresh }}
    >
      {children}
    </AuthContext.Provider>
  );
}
