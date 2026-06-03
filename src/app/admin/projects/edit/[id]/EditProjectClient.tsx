"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ProjectEditor } from "@/components/admin/ProjectEditor";
import { updateProject, adminGetProjectBySlug } from "@/lib/firebase";
import { isFirebaseConfigured } from "@/lib/firebaseConfig";
import { useAuth } from "@/contexts/AuthContext";

interface EditProjectClientProps {
  slug: string;
}

export default function EditProjectClient({ slug }: EditProjectClientProps) {
  const router = useRouter();
  const { can } = useAuth();
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProject() {
      try {
        const data = await adminGetProjectBySlug(slug);
        if (!data) {
          alert("Project not found");
          router.push("/admin/projects");
          return;
        }
        setProject(data);
      } catch (err) {
        console.error("Failed to load project:", err);
      } finally {
        setLoading(false);
      }
    }
    loadProject();
  }, [slug, router, can]);

  const handleSave = async (slug: string, data: any) => {
    if (!isFirebaseConfigured) {
      alert("Firebase not configured. Simulated in sandbox mode.");
      router.push("/admin/projects");
      return;
    }

    try {
      await updateProject(slug, data);
      router.push("/admin/projects");
      router.refresh();
    } catch (err) {
      console.error("Failed to update project:", err);
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

  return project ? <ProjectEditor project={project} onSave={handleSave} /> : null;
}
