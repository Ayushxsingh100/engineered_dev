/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  collection,
  getDocs,
  doc,
  getDoc,
  query,
  where,
  orderBy,
  limit,
} from "firebase/firestore";
import { db, isFirebaseConfigured } from "./firebaseConfig";

// Shared utilities (single source of truth)
import {
  formatTimestamp,
  processFirestorePost,
  processFirestoreProject,
  type ProjectCaseStudy,
} from "./firebaseUtils";

// Fallback imports
import {
  getAllPosts as getLocalPosts,
  getPostBySlug as getLocalPostBySlug,
  getFeaturedPosts as getLocalFeaturedPosts,
  getRelatedPosts as getLocalRelatedPosts,
  getAllTags as getLocalTags,
  type BlogPost,
  type BlogMeta,
} from "./blog";

import {
  getAllProjects as getLocalProjects,
  getFeaturedProjects as getLocalFeaturedProjects,
  type Project,
} from "./projects";

// Re-export type definitions
export type { BlogPost, BlogMeta, Project, ProjectCaseStudy };

/* -------------------------------------------------------------------------- */
/*  Constants                                                                  */
/* -------------------------------------------------------------------------- */

/** Default limit for list queries to prevent unbounded Firestore reads */
const DEFAULT_POST_LIMIT = 50;
const HOMEPAGE_POST_LIMIT = 15;
const RELATED_POSTS_LIMIT = 3;
const RSS_POST_LIMIT = 50;

/* -------------------------------------------------------------------------- */
/*  Public Blog Queries                                                       */
/* -------------------------------------------------------------------------- */

export async function getAllPosts(maxResults = DEFAULT_POST_LIMIT): Promise<BlogMeta[]> {
  if (!isFirebaseConfigured || !db) {
    return getLocalPosts();
  }

  try {
    const q = query(
      collection(db, "posts"),
      where("status", "==", "published"),
      orderBy("publishedAt", "desc"),
      limit(maxResults)
    );
    const snap = await getDocs(q);

    return snap.docs.map((docSnap) => {
      const processed = processFirestorePost(docSnap);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { content: _, ...meta } = processed;
      return meta;
    });
  } catch (error) {
    console.error("Failed to query posts from Firestore, falling back:", error);
    return getLocalPosts();
  }
}

/** Optimized homepage query with a smaller limit */
export async function getHomepagePosts(): Promise<BlogMeta[]> {
  return getAllPosts(HOMEPAGE_POST_LIMIT);
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  if (!isFirebaseConfigured || !db) {
    try {
      return getLocalPostBySlug(slug);
    } catch {
      return null;
    }
  }

  try {
    const docSnap = await getDoc(doc(db, "posts", slug));
    if (!docSnap.exists()) return null;
    
    const data = docSnap.data();
    if (data.status !== "published" && data.published !== true) {
      return null;
    }
    
    return processFirestorePost(docSnap);
  } catch (error) {
    console.error(`Failed to fetch post "${slug}" from Firestore, falling back:`, error);
    try {
      return getLocalPostBySlug(slug);
    } catch {
      return null;
    }
  }
}

export async function getFeaturedPosts(): Promise<BlogMeta[]> {
  if (!isFirebaseConfigured || !db) {
    return getLocalFeaturedPosts();
  }

  try {
    const q = query(
      collection(db, "posts"),
      where("status", "==", "published"),
      where("featured", "==", true),
      orderBy("publishedAt", "desc"),
      limit(10)
    );
    const snap = await getDocs(q);
    return snap.docs.map((docSnap) => {
      const processed = processFirestorePost(docSnap);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { content: _, ...meta } = processed;
      return meta;
    });
  } catch (error) {
    console.error("Failed to query featured posts from Firestore, falling back:", error);
    return getLocalFeaturedPosts();
  }
}

export async function getRelatedPosts(slug: string, limitCount = RELATED_POSTS_LIMIT): Promise<BlogMeta[]> {
  const currentPost = await getPostBySlug(slug);
  if (!currentPost) return [];

  if (!isFirebaseConfigured || !db) {
    return getLocalRelatedPosts(slug, currentPost.tags, limitCount);
  }

  try {
    // Fetch a reasonable number of recent posts to score against (not ALL posts)
    const q = query(
      collection(db, "posts"),
      where("status", "==", "published"),
      orderBy("publishedAt", "desc"),
      limit(30)
    );
    const snap = await getDocs(q);
    const all = snap.docs
      .filter((docSnap) => docSnap.id !== slug)
      .map((docSnap) => processFirestorePost(docSnap));

    const scored = all.map((post) => {
      const overlap = post.tags.filter((t) => currentPost.tags.includes(t)).length;
      return { post, score: overlap };
    });

    return scored
      .filter((s) => s.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, limitCount)
      .map((s) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { content: _, ...meta } = s.post;
        return meta;
      });
  } catch (error) {
    console.error("Failed to query related posts from Firestore, falling back:", error);
    return getLocalRelatedPosts(slug, currentPost.tags, limitCount);
  }
}

export async function getAllTags(): Promise<string[]> {
  if (!isFirebaseConfigured || !db) {
    return getLocalTags();
  }

  try {
    // Only query published posts for tags (matches security rules)
    const q = query(
      collection(db, "posts"),
      where("status", "==", "published"),
      limit(200)
    );
    const snap = await getDocs(q);
    const tags = new Set<string>();
    snap.docs.forEach((docSnap) => {
      const data = docSnap.data();
      if (data.tags) {
        data.tags.forEach((t: string) => tags.add(t));
      }
    });
    return Array.from(tags).sort();
  } catch (error) {
    console.error("Failed to compile tags from Firestore, falling back:", error);
    return getLocalTags();
  }
}

/* -------------------------------------------------------------------------- */
/*  Public Projects Queries                                                   */
/* -------------------------------------------------------------------------- */

export async function getAllProjects(): Promise<ProjectCaseStudy[]> {
  if (!isFirebaseConfigured || !db) {
    return getLocalProjects();
  }

  try {
    const q = query(
      collection(db, "projects"),
      where("status", "==", "published"),
      orderBy("publishedAt", "desc"),
      limit(50)
    );
    const snap = await getDocs(q);
    return snap.docs.map((docSnap) => processFirestoreProject(docSnap));
  } catch (error) {
    console.error("Failed to query projects from Firestore, falling back:", error);
    return getLocalProjects();
  }
}

export async function getProjectBySlug(slug: string): Promise<ProjectCaseStudy | null> {
  if (!isFirebaseConfigured || !db) {
    const all = getLocalProjects();
    const found = all.find((p) => p.id === slug);
    return found || null;
  }

  try {
    const docSnap = await getDoc(doc(db, "projects", slug));
    if (!docSnap.exists()) return null;
    return processFirestoreProject(docSnap);
  } catch (error) {
    console.error(`Failed to fetch project "${slug}" from Firestore, falling back:`, error);
    const all = getLocalProjects();
    const found = all.find((p) => p.id === slug);
    return found || null;
  }
}

export async function getFeaturedProjects(): Promise<ProjectCaseStudy[]> {
  if (!isFirebaseConfigured || !db) {
    return getLocalFeaturedProjects();
  }

  try {
    const q = query(
      collection(db, "projects"),
      where("status", "==", "published"),
      where("featured", "==", true),
      orderBy("publishedAt", "desc"),
      limit(10)
    );
    const snap = await getDocs(q);
    return snap.docs.map((docSnap) => processFirestoreProject(docSnap));
  } catch (error) {
    console.error("Failed to query featured projects from Firestore, falling back:", error);
    return getLocalFeaturedProjects();
  }
}

export async function getAuthorBio(authorId: string): Promise<string> {
  if (!isFirebaseConfigured || !db || !authorId) return "";
  try {
    const docSnap = await getDoc(doc(db, "users", authorId));
    if (docSnap.exists() && docSnap.data().bio) {
      return docSnap.data().bio;
    }
  } catch (error) {
    console.error(`Failed to fetch author bio for ${authorId}:`, error);
  }
  return "";
}
