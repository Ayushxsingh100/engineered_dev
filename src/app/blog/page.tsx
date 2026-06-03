import type { Metadata } from "next";
import { Suspense } from "react";
import { getAllPosts, getAllTags } from "@/lib/firebaseServer";
import BlogPageClient from "./BlogPageClient";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Writing",
  description:
    "Articles on cloud computing, backend engineering, system design, and building scalable distributed systems.",
};

export default async function BlogPage() {
  const posts = await getAllPosts();
  const tags = await getAllTags();

  return (
    <div className="pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-5 sm:px-6">
        {/* Page header */}
        <div className="mb-12 space-y-3">
          <div className="flex items-center gap-3">
            <span className="h-px w-6 bg-accent" />
            <span className="tag-badge">Writing</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-text-primary">
            Articles & deep-dives
          </h1>
          <p className="text-base text-text-secondary leading-relaxed max-w-xl">
            Technical writing on distributed systems, cloud architecture, backend engineering,
            and the decisions that define how modern software is built.
          </p>
        </div>

        <Suspense fallback={<div className="h-32 flex items-center justify-center text-sm font-mono text-text-tertiary animate-pulse">Loading articles...</div>}>
          <BlogPageClient posts={posts} tags={tags} />
        </Suspense>
      </div>
    </div>
  );
}
