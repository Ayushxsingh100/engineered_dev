/* eslint-disable @typescript-eslint/no-explicit-any */
/* ============================================================================
   Firebase Client Operations — Multi-Author CMS
   ============================================================================ */

import {
  collection,
  getDocs,
  doc,
  getDoc,
  query,
  orderBy,
  where,
  setDoc,
  deleteDoc,
  updateDoc,
  Timestamp,
  writeBatch,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { db, storage, isFirebaseConfigured } from "./firebaseConfig";
import type {
  CmsPost,
  CmsCategory,
  CmsSeries,
  CmsUser,
  UserRole,
  PostStatus,
} from "./cms-types";

// Shared utilities (single source of truth)
import {
  formatTimestamp,
  processFirestoreProject,
  type ProjectCaseStudy,
} from "./firebaseUtils";

// Import types only (erased at runtime)
import type { BlogPost, BlogMeta } from "./blog";
import type { Project } from "./projects";

// Re-export type definitions
export type { BlogPost, BlogMeta, Project, ProjectCaseStudy };

/* -------------------------------------------------------------------------- */
/*  Admin Post Operations                                                     */
/* -------------------------------------------------------------------------- */

/** Get all posts including drafts (for admin listing) */
export async function adminGetAllPosts(): Promise<CmsPost[]> {
  if (!db) return [];
  const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((docSnap) => {
    const data = docSnap.data();
    return {
      slug: docSnap.id,
      title: data.title || "",
      description: data.description || "",
      body: data.body || "",
      coverImageUrl: data.coverImageUrl || "",
      category: data.category || "",
      tags: data.tags || [],
      series: data.series || null,
      seriesOrder: data.seriesOrder || null,
      seoTitle: data.seoTitle || "",
      seoDescription: data.seoDescription || "",
      status: (data.status as PostStatus) || (data.published ? "published" : "draft"),
      publishedAt: data.publishedAt ? formatTimestamp(data.publishedAt) : null,
      scheduledAt: data.scheduledAt ? formatTimestamp(data.scheduledAt) : null,
      authorId: data.authorId || "",
      authorName: data.authorName || data.author || "",
      authorAvatar: data.authorAvatar || "",
      featured: !!data.featured,
      createdAt: formatTimestamp(data.createdAt),
      updatedAt: formatTimestamp(data.updatedAt),
      lastSavedAt: formatTimestamp(data.lastSavedAt || data.updatedAt),
    } as CmsPost;
  });
}

/** Get a specific post for admin editing */
export async function adminGetPostBySlug(slug: string): Promise<CmsPost | null> {
  if (!db) return null;
  const docSnap = await getDoc(doc(db, "posts", slug));
  if (!docSnap.exists()) return null;
  
  const data = docSnap.data();
  return {
    slug: docSnap.id,
    title: data.title || "",
    description: data.description || "",
    body: data.body || "",
    coverImageUrl: data.coverImageUrl || "",
    category: data.category || "",
    tags: data.tags || [],
    series: data.series || null,
    seriesOrder: data.seriesOrder || null,
    seoTitle: data.seoTitle || "",
    seoDescription: data.seoDescription || "",
    status: (data.status as PostStatus) || (data.published ? "published" : "draft"),
    publishedAt: data.publishedAt ? formatTimestamp(data.publishedAt) : null,
    scheduledAt: data.scheduledAt ? formatTimestamp(data.scheduledAt) : null,
    authorId: data.authorId || "",
    authorName: data.authorName || data.author || "",
    authorAvatar: data.authorAvatar || "",
    featured: !!data.featured,
    createdAt: formatTimestamp(data.createdAt),
    updatedAt: formatTimestamp(data.updatedAt),
    lastSavedAt: formatTimestamp(data.lastSavedAt || data.updatedAt),
  } as CmsPost;
}

/** Create a new post — always starts as draft */
export async function createPost(slug: string, postData: any): Promise<void> {
  if (!db) return;
  const now = Timestamp.now();
  await setDoc(doc(db, "posts", slug), {
    title: postData.title || "",
    description: postData.description || "",
    body: postData.body || "",
    coverImageUrl: postData.coverImageUrl || "",
    category: postData.category || "",
    tags: postData.tags || [],
    series: postData.series || null,
    seriesOrder: postData.seriesOrder || null,
    seoTitle: postData.seoTitle || "",
    seoDescription: postData.seoDescription || "",
    status: postData.status || "draft",
    publishedAt: postData.status === "published" ? now : null,
    scheduledAt: postData.scheduledAt
      ? Timestamp.fromDate(new Date(postData.scheduledAt))
      : null,
    authorId: postData.authorId || "",
    authorName: postData.authorName || "",
    authorAvatar: postData.authorAvatar || "",
    featured: !!postData.featured,
    published: postData.status === "published",
    createdAt: now,
    updatedAt: now,
    lastSavedAt: now,
  });
}

/** Update an existing post (preserves authorId) */
export async function updatePost(slug: string, postData: any): Promise<void> {
  if (!db) return;
  const now = Timestamp.now();
  const updatePayload: any = {
    title: postData.title,
    description: postData.description,
    body: postData.body,
    coverImageUrl: postData.coverImageUrl || "",
    category: postData.category || "",
    tags: postData.tags || [],
    series: postData.series || null,
    seriesOrder: postData.seriesOrder || null,
    seoTitle: postData.seoTitle || "",
    seoDescription: postData.seoDescription || "",
    status: postData.status,
    featured: !!postData.featured,
    published: postData.status === "published",
    updatedAt: now,
    lastSavedAt: now,
  };

  if (postData.status === "published" && !postData.publishedAt) {
    updatePayload.publishedAt = now;
  }
  if (postData.scheduledAt) {
    updatePayload.scheduledAt = Timestamp.fromDate(new Date(postData.scheduledAt));
  } else {
    updatePayload.scheduledAt = null;
  }

  await setDoc(doc(db, "posts", slug), updatePayload, { merge: true });
}

/** Auto-save: lightweight update that doesn't change status */
export async function autoSavePost(slug: string, partialData: Partial<CmsPost>): Promise<void> {
  if (!db) return;
  await updateDoc(doc(db, "posts", slug), {
    ...partialData,
    lastSavedAt: Timestamp.now(),
  });
}

/** Publish a post immediately */
export async function publishPost(slug: string): Promise<void> {
  if (!db) return;
  const now = Timestamp.now();
  await updateDoc(doc(db, "posts", slug), {
    status: "published",
    published: true,
    publishedAt: now,
    updatedAt: now,
  });
}

/** Schedule a post for future publication */
export async function schedulePost(slug: string, scheduledDate: string): Promise<void> {
  if (!db) return;
  await updateDoc(doc(db, "posts", slug), {
    status: "scheduled",
    scheduledAt: Timestamp.fromDate(new Date(scheduledDate)),
    updatedAt: Timestamp.now(),
  });
}

/** Archive a post */
export async function archivePost(slug: string): Promise<void> {
  if (!db) return;
  await updateDoc(doc(db, "posts", slug), {
    status: "archived",
    published: false,
    updatedAt: Timestamp.now(),
  });
}

/** Unpublish — move back to draft */
export async function unpublishPost(slug: string): Promise<void> {
  if (!db) return;
  await updateDoc(doc(db, "posts", slug), {
    status: "draft",
    published: false,
    updatedAt: Timestamp.now(),
  });
}

export async function deletePost(slug: string): Promise<void> {
  if (!db) return;
  await deleteDoc(doc(db, "posts", slug));
}

/* -------------------------------------------------------------------------- */
/*  Category Operations                                                       */
/* -------------------------------------------------------------------------- */

export async function getAllCategories(): Promise<CmsCategory[]> {
  if (!db) return [];
  const q = query(collection(db, "categories"), orderBy("order", "asc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({
    id: d.id,
    name: d.data().name || "",
    slug: d.data().slug || "",
    description: d.data().description || "",
    order: d.data().order || 0,
    createdAt: formatTimestamp(d.data().createdAt),
  }));
}

export async function createCategory(data: Omit<CmsCategory, "id" | "createdAt">): Promise<string> {
  if (!db) throw new Error("Firestore not initialized");
  const docRef = doc(collection(db, "categories"));
  await setDoc(docRef, {
    ...data,
    createdAt: Timestamp.now(),
  });
  return docRef.id;
}

export async function updateCategory(id: string, data: Partial<CmsCategory>): Promise<void> {
  if (!db) return;
  const { id: _id, createdAt: _ca, ...rest } = data;
  void _id; void _ca;
  await updateDoc(doc(db, "categories", id), rest);
}

export async function deleteCategory(id: string): Promise<void> {
  if (!db) return;
  await deleteDoc(doc(db, "categories", id));
}

/* -------------------------------------------------------------------------- */
/*  Series Operations                                                         */
/* -------------------------------------------------------------------------- */

export async function getAllSeries(): Promise<CmsSeries[]> {
  if (!db) return [];
  const snap = await getDocs(collection(db, "series"));
  return snap.docs.map((d) => ({
    id: d.id,
    name: d.data().name || "",
    slug: d.data().slug || "",
    description: d.data().description || "",
    createdAt: formatTimestamp(d.data().createdAt),
  }));
}

export async function createSeries(data: Omit<CmsSeries, "id" | "createdAt">): Promise<string> {
  if (!db) throw new Error("Firestore not initialized");
  const docRef = doc(collection(db, "series"));
  await setDoc(docRef, { ...data, createdAt: Timestamp.now() });
  return docRef.id;
}

/* -------------------------------------------------------------------------- */
/*  User / Team Operations                                                    */
/* -------------------------------------------------------------------------- */

export async function getAllUsers(): Promise<CmsUser[]> {
  if (!db) return [];
  const snap = await getDocs(collection(db, "users"));
  return snap.docs.map((d) => {
    const data = d.data();
    return {
      uid: d.id,
      email: data.email || "",
      displayName: data.displayName || "",
      avatarUrl: data.avatarUrl || "",
      bio: data.bio || "",
      role: (data.role as UserRole) || "author",
      socialLinks: data.socialLinks || {},
      createdAt: formatTimestamp(data.createdAt),
      updatedAt: formatTimestamp(data.updatedAt),
      disabled: !!data.disabled,
    };
  });
}

export async function inviteUser(email: string, role: UserRole, invitedBy: string): Promise<void> {
  if (!db) return;
  const normalizedEmail = email.toLowerCase().trim();
  const docRef = doc(db, "invites", normalizedEmail);
  await setDoc(docRef, {
    email: normalizedEmail,
    role,
    invitedAt: Timestamp.now(),
    invitedBy,
  });
}

export async function updateUserRole(uid: string, role: UserRole): Promise<void> {
  if (!db) return;
  await updateDoc(doc(db, "users", uid), { role, updatedAt: Timestamp.now() });
}

export async function disableUser(uid: string, disabled: boolean): Promise<void> {
  if (!db) return;
  await updateDoc(doc(db, "users", uid), { disabled, updatedAt: Timestamp.now() });
}

export async function deleteUser(uid: string): Promise<void> {
  if (!db) return;
  await deleteDoc(doc(db, "users", uid));
}

/* -------------------------------------------------------------------------- */
/*  Project Operations (unchanged API, kept for backward compatibility)       */
/* -------------------------------------------------------------------------- */

export async function adminGetAllProjects(): Promise<ProjectCaseStudy[]> {
  if (!db) return [];
  const q = query(collection(db, "projects"), orderBy("publishedAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((docSnap) => processFirestoreProject(docSnap));
}

export async function adminGetProjectBySlug(slug: string): Promise<ProjectCaseStudy | null> {
  if (!db) return null;
  const docSnap = await getDoc(doc(db, "projects", slug));
  if (!docSnap.exists()) return null;
  return processFirestoreProject(docSnap);
}

export async function createProject(slug: string, projectData: any): Promise<void> {
  if (!db) return;
  await setDoc(doc(db, "projects", slug), {
    ...projectData,
    publishedAt: projectData.publishedAt
      ? Timestamp.fromDate(new Date(projectData.publishedAt))
      : Timestamp.now(),
  });
}

export async function updateProject(slug: string, projectData: any): Promise<void> {
  if (!db) return;
  await setDoc(
    doc(db, "projects", slug),
    {
      ...projectData,
      publishedAt: projectData.publishedAt
        ? Timestamp.fromDate(new Date(projectData.publishedAt))
        : Timestamp.now(),
    },
    { merge: true }
  );
}

export async function deleteProject(slug: string): Promise<void> {
  if (!db) return;
  await deleteDoc(doc(db, "projects", slug));
}

/* -------------------------------------------------------------------------- */
/*  Storage Operations                                                        */
/* -------------------------------------------------------------------------- */

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp", "image/avif"];

export async function uploadImage(file: File, path: string): Promise<string> {
  if (!storage) throw new Error("Firebase Storage is not initialized.");

  // Validation
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    throw new Error(`Invalid file type "${file.type}". Allowed: JPEG, PNG, GIF, WebP, AVIF.`);
  }
  if (file.size > MAX_IMAGE_SIZE) {
    throw new Error(`File too large (${(file.size / 1024 / 1024).toFixed(1)}MB). Maximum is 5MB.`);
  }

  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file, { contentType: file.type });
  return getDownloadURL(storageRef);
}

export async function deleteImage(path: string): Promise<void> {
  if (!storage) return;
  const storageRef = ref(storage, path);
  await deleteObject(storageRef);
}
