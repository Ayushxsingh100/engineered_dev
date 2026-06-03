/* ============================================================================
   Firebase Shared Utilities
   Common helpers used by both client (firebase.ts) and server (firebaseServer.ts)
   ============================================================================ */

/* eslint-disable @typescript-eslint/no-explicit-any */

import readingTime from "reading-time";
import type { BlogPost } from "./blog";
import type { Project } from "./projects";

export interface ProjectCaseStudy extends Project {
  slug?: string;
  coverImage?: string;
  publishedAt?: string;
  scalability?: string;
  implementation?: string;
  lessonsLearned?: string;
}

/* -------------------------------------------------------------------------- */
/*  Environment Validation                                                     */
/* -------------------------------------------------------------------------- */

const REQUIRED_ENV_KEYS = [
  "NEXT_PUBLIC_FIREBASE_API_KEY",
  "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
  "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
  "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET",
  "NEXT_PUBLIC_FIREBASE_APP_ID",
] as const;

/**
 * Validates that all required Firebase environment variables are set.
 * Returns true only if ALL required keys are present and non-empty.
 */
export function validateFirebaseEnv(): boolean {
  // Next.js replaces process.env statically, so dynamic access like process.env[key] fails on the client.
  const envConfig = {
    NEXT_PUBLIC_FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    NEXT_PUBLIC_FIREBASE_PROJECT_ID: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    NEXT_PUBLIC_FIREBASE_APP_ID: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  };

  const allPresent = REQUIRED_ENV_KEYS.every(
    (key) => !!envConfig[key]?.trim()
  );

  if (!allPresent && process.env.NODE_ENV !== "production") {
    const missing = REQUIRED_ENV_KEYS.filter((key) => !envConfig[key]?.trim());
    console.warn(
      `Firebase config incomplete. Missing: ${missing.join(", ")}. Falling back to local data.`
    );
  }

  return allPresent;
}

/* -------------------------------------------------------------------------- */
/*  Timestamp Formatting                                                       */
/* -------------------------------------------------------------------------- */

export function formatTimestamp(t: any): string {
  if (!t) return new Date().toISOString();
  if (t.toDate && typeof t.toDate === "function") {
    return t.toDate().toISOString();
  }
  if (t.seconds) {
    return new Date(t.seconds * 1000).toISOString();
  }
  return new Date(t).toISOString();
}

/* -------------------------------------------------------------------------- */
/*  Firestore Document Processors                                              */
/* -------------------------------------------------------------------------- */

export function processFirestorePost(docSnap: any): BlogPost {
  const data = docSnap.data();
  const content = data.body || "";

  // Support both old `published` boolean and new `status` field
  const isPublished = data.status === "published" || !!data.published;

  return {
    slug: docSnap.id,
    title: data.title || "",
    description: data.description || "",
    date: formatTimestamp(data.publishedAt),
    tags: data.tags || [],
    readingTime: readingTime(content).text,
    content,
    featured: !!data.featured,
    published: isPublished,
    author: data.authorName || data.author || "Unknown",
    authorId: data.authorId || undefined,
    authorAvatar: data.authorAvatar || undefined,
    image: data.coverImageUrl || undefined,
  };
}

export function processFirestoreProject(docSnap: any): ProjectCaseStudy {
  const data = docSnap.data();
  return {
    id: docSnap.id,
    slug: docSnap.id,
    name: data.title || "",
    description: data.description || "",
    category: data.category || "General",
    techStack: data.techStack || [],
    githubUrl: data.githubUrl || "#",
    liveUrl: data.liveUrl || undefined,
    challenges: data.challenges || [],
    featured: !!data.featured,
    architecture: data.architecture || "",
    scalability: data.scalability || "",
    implementation: data.implementation || "",
    lessonsLearned: data.lessonsLearned || "",
    publishedAt: formatTimestamp(data.publishedAt),
    coverImage: data.coverImageUrl || undefined,
  };
}
