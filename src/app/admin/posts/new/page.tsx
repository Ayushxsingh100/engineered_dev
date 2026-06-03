"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useRouter } from "next/navigation";
import { PostEditor } from "@/components/admin/PostEditor";
import { createPost } from "@/lib/firebase";
import { isFirebaseConfigured } from "@/lib/firebaseConfig";

export default function NewPostPage() {
  const router = useRouter();

  const handleSave = async (slug: string, data: any) => {
    if (!isFirebaseConfigured) {
      alert("Firebase not configured. Simulated in sandbox mode.");
      router.push("/admin/posts");
      return;
    }

    try {
      await createPost(slug, data);
      router.push("/admin/posts");
      router.refresh();
    } catch (err) {
      console.error("Failed to create post:", err);
      throw err;
    }
  };

  return <PostEditor onSave={handleSave} />;
}
