"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PostEditor } from "@/components/admin/PostEditor";
import { updatePost, adminGetPostBySlug } from "@/lib/firebase";
import { isFirebaseConfigured } from "@/lib/firebaseConfig";
import { useAuth } from "@/contexts/AuthContext";

interface EditPostClientProps {
  slug: string;
}

export default function EditPostClient({ slug }: EditPostClientProps) {
  const router = useRouter();
  const { can } = useAuth();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPost() {
      try {
        const data = await adminGetPostBySlug(slug);
        if (!data) {
          alert("Post not found");
          router.push("/admin/posts");
          return;
        }
        setPost(data);
      } catch (err) {
        console.error("Failed to load post:", err);
      } finally {
        setLoading(false);
      }
    }
    loadPost();
  }, [slug, router, can]);

  const handleSave = async (slug: string, data: any) => {
    if (!isFirebaseConfigured) {
      alert("Firebase not configured. Simulated in sandbox mode.");
      router.push("/admin/posts");
      return;
    }

    try {
      await updatePost(slug, data);
      router.push("/admin/posts");
      router.refresh();
    } catch (err) {
      console.error("Failed to update post:", err);
      throw err;
    }
  };

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "6rem 0" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div className="cms-saving" style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--studio-accent)" }} />
          <span style={{ fontSize: "0.875rem", color: "var(--studio-text-3)", fontWeight: 500 }}>Loading editor...</span>
        </div>
      </div>
    );
  }

  return post ? <PostEditor post={post} onSave={handleSave} /> : null;
}

