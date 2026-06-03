"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import type { BlogMeta } from "@/lib/firebase";
import { BlogCard } from "@/components/BlogCard";
import { KnowledgeGraph } from "@/components/KnowledgeGraph";

interface BlogPageClientProps {
  posts: BlogMeta[];
  tags: string[];
}

export default function BlogPageClient({ posts, tags }: BlogPageClientProps) {
  const searchParams = useSearchParams();
  const initialTag = searchParams.get("tag");

  const [searchQuery, setSearchQuery] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(initialTag);
  const [showGraph, setShowGraph] = useState(!initialTag); // default to list if tag is provided
  const [visibleCount, setVisibleCount] = useState(12);

  useEffect(() => {
    const tag = searchParams.get("tag");
    if (tag) {
      setActiveTag(tag);
      setShowGraph(false);
    }
  }, [searchParams]);

  const filteredPosts = useMemo(() => {
    let results = posts;

    if (activeTag) {
      results = results.filter((post) =>
        post.tags?.some(
          (tag) => tag.toLowerCase() === activeTag.toLowerCase()
        )
      );
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      results = results.filter(
        (post) =>
          post.title.toLowerCase().includes(query) ||
          post.description.toLowerCase().includes(query) ||
          post.tags?.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    return results;
  }, [posts, searchQuery, activeTag]);

  // Reset pagination when filters change
  useEffect(() => {
    setVisibleCount(12);
  }, [searchQuery, activeTag]);

  const handleTagClick = (tag: string) => {
    setActiveTag((current) => (current === tag ? null : tag));
  };

  return (
    <div className="space-y-8">
      {/* Dynamic Navigation Mode Selector */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-accent/10 pb-4">
          <div>
            <h2 className="text-xs font-mono uppercase tracking-widest text-muted-foreground font-bold flex items-center gap-2">
              Navigation Mode
              <svg className="w-4 h-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 100-18 9 9 0 000 18z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 9.75L16.5 7.5l-2.25 6.75L7.5 16.5l6.75-2.25L16.5 7.5l-2.25 2.25z" />
              </svg>
            </h2>
            <p className="text-[11px] text-muted-foreground mt-1 font-medium">
              {showGraph ? "Interactive Concept Topology Web" : "Standard Filter Index Tags"}
            </p>
          </div>
          <button
            onClick={() => setShowGraph(!showGraph)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-accent/20 text-[11px] font-bold bg-accent/5 hover:bg-accent/15 text-accent transition-all duration-200 cursor-pointer hover:shadow-[0_0_12px_rgba(139,92,246,0.15)] hover:scale-105 active:scale-95"
          >
            {showGraph ? (
              <>
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-3.75-2.25v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25A2.25 2.25 0 0 1 13.5 8.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
                </svg>
                <span>Use List Tags</span>
              </>
            ) : (
              <>
                <svg className="w-3.5 h-3.5 animate-pulse" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94-3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
                </svg>
                <span>Use Concept Web</span>
              </>
            )}
          </button>
        </div>

        {showGraph ? (
          <div className="animate-in fade-in slide-in-from-top-2 duration-300">
            <KnowledgeGraph activeTag={activeTag} onTagClick={handleTagClick} />
          </div>
        ) : (
          /* Tag filters */
          tags.length > 0 && (
            <div className="flex flex-wrap gap-2 animate-in fade-in duration-200">
              <button
                onClick={() => setActiveTag(null)}
                className={[
                  "h-8 px-4 rounded-full text-xs font-bold transition-all border cursor-pointer",
                  activeTag === null
                    ? "genz-btn-gradient border-transparent shadow-[0_0_15px_rgba(139,92,246,0.25)]"
                    : "bg-accent/5 border-accent/20 text-text-secondary hover:text-accent hover:border-accent hover:bg-accent/10",
                ].join(" ")}
              >
                All
              </button>
              {tags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => handleTagClick(tag)}
                  className={[
                    "h-8 px-4 rounded-full text-xs font-bold transition-all border capitalize cursor-pointer",
                    activeTag === tag
                      ? "genz-btn-gradient border-transparent shadow-[0_0_15px_rgba(139,92,246,0.25)]"
                      : "bg-accent/5 border-accent/20 text-text-secondary hover:text-accent hover:border-accent hover:bg-accent/10",
                  ].join(" ")}
                >
                  {tag.replace(/-/g, " ")}
                </button>
              ))}
            </div>
          )
        )}
      </div>

      {/* Search + filter row */}
      <div className="space-y-4">
        {/* Search */}
        <div className="relative">
          <svg
            className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-accent/50 pointer-events-none"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search articles by title, description or tag…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-11 pl-11 pr-10 rounded-full genz-glass border border-accent/15 text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/15 focus:shadow-[0_0_20px_rgba(139,92,246,0.1)] transition-all font-medium"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-accent transition-colors cursor-pointer"
              aria-label="Clear search"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Result count */}
      <p className="text-xs text-text-tertiary font-mono">
        {filteredPosts.length} {filteredPosts.length === 1 ? "article" : "articles"}
        {activeTag ? ` in "${activeTag}"` : ""}
        {searchQuery ? ` matching "${searchQuery}"` : ""}
      </p>

      {/* Post grid */}
      {filteredPosts.length > 0 ? (
        <div className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {filteredPosts.slice(0, visibleCount).map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>
          
          {visibleCount < filteredPosts.length && (
            <div className="flex justify-center pt-8 border-t border-accent/10">
              <button
                onClick={() => setVisibleCount((prev) => prev + 12)}
                className="cms-btn cms-btn-ghost px-8 py-3 font-semibold text-[13px] uppercase tracking-wider"
              >
                Load More Drops
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="genz-glass rounded-2xl p-12 text-center space-y-2">
          <p className="text-base font-medium text-text-primary flex items-center justify-center gap-2">
            No articles found 
            <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
          </p>
          <p className="text-sm text-text-secondary">
            {searchQuery
              ? `No articles match "${searchQuery}".`
              : "No articles available yet."}
          </p>
        </div>
      )}
    </div>
  );
}
