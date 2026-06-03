/* ============================================================================
   CMS Type Definitions
   Multi-author publishing platform types for Firestore collections
   ============================================================================ */

/* -------------------------------------------------------------------------- */
/*  Roles & Permissions                                                       */
/* -------------------------------------------------------------------------- */

export type UserRole = "owner" | "admin" | "author";

export type PostStatus = "draft" | "review" | "scheduled" | "published" | "archived";

export type CmsPermission =
  | "posts.create"
  | "posts.edit_own"
  | "posts.edit_any"
  | "posts.publish"
  | "posts.delete"
  | "posts.archive"
  | "categories.manage"
  | "series.manage"
  | "users.manage";

const ROLE_PERMISSIONS: Record<UserRole, CmsPermission[]> = {
  owner: [
    "posts.create", "posts.edit_own", "posts.edit_any", "posts.publish",
    "posts.delete", "posts.archive", "categories.manage", "series.manage",
    "users.manage",
  ],
  admin: [
    "posts.create", "posts.edit_own", "posts.edit_any", "posts.publish",
    "posts.delete", "posts.archive", "categories.manage", "series.manage",
  ],
  author: [
    "posts.create", "posts.edit_own",
  ],
};

export function hasPermission(role: UserRole | null, permission: CmsPermission): boolean {
  if (!role) return false;
  return ROLE_PERMISSIONS[role].includes(permission);
}

/* -------------------------------------------------------------------------- */
/*  User                                                                      */
/* -------------------------------------------------------------------------- */

export interface CmsUser {
  uid: string;
  email: string;
  displayName: string;
  avatarUrl: string;
  bio: string;
  role: UserRole;
  socialLinks: {
    github?: string;
    twitter?: string;
    linkedin?: string;
  };
  createdAt: string;
  updatedAt: string;
  disabled: boolean;
}

/** Placeholder for invited users who haven't signed in yet */
export interface UserInvite {
  email: string;
  role: UserRole;
  invitedAt: string;
  invitedBy: string;
}

/* -------------------------------------------------------------------------- */
/*  Post                                                                      */
/* -------------------------------------------------------------------------- */

export interface CmsPost {
  slug: string;
  title: string;
  description: string;
  body: string;
  coverImageUrl: string;
  category: string;
  tags: string[];
  series: string | null;
  seriesOrder: number | null;
  seoTitle: string;
  seoDescription: string;
  status: PostStatus;
  publishedAt: string | null;
  scheduledAt: string | null;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
  lastSavedAt: string;
}

/** Validation result for publish-readiness */
export interface PostValidation {
  valid: boolean;
  errors: string[];
}

export function validatePostForPublish(post: Partial<CmsPost>): PostValidation {
  const errors: string[] = [];
  if (!post.title?.trim()) errors.push("Title is required");
  if (!post.slug?.trim()) errors.push("Slug is required");
  if (!post.description?.trim()) errors.push("Excerpt is required");
  if (!post.category?.trim()) errors.push("Category is required");
  if (!post.coverImageUrl?.trim()) errors.push("Cover image is required");
  if (!post.body?.trim()) errors.push("Content is required");
  return { valid: errors.length === 0, errors };
}

/* -------------------------------------------------------------------------- */
/*  Category                                                                  */
/* -------------------------------------------------------------------------- */

export interface CmsCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  order: number;
  createdAt: string;
}

/* -------------------------------------------------------------------------- */
/*  Series                                                                    */
/* -------------------------------------------------------------------------- */

export interface CmsSeries {
  id: string;
  name: string;
  slug: string;
  description: string;
  createdAt: string;
}
