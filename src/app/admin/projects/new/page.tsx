"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useRouter } from "next/navigation";
import { ProjectEditor } from "@/components/admin/ProjectEditor";
import { createProject } from "@/lib/firebase";
import { isFirebaseConfigured } from "@/lib/firebaseConfig";

export default function NewProjectPage() {
  const router = useRouter();

  const handleSave = async (slug: string, data: any) => {
    if (!isFirebaseConfigured) {
      alert("Firebase not configured. Simulated in sandbox mode.");
      router.push("/admin/projects");
      return;
    }

    try {
      await createProject(slug, data);
      router.push("/admin/projects");
      router.refresh();
    } catch (err) {
      console.error("Failed to create project:", err);
      throw err;
    }
  };

  return <ProjectEditor onSave={handleSave} />;
}
