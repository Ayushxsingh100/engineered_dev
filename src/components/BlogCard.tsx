import Link from "next/link";
import Image from "next/image";
import type { BlogMeta } from "@/lib/firebase";

interface BlogCardProps {
  post: BlogMeta;
}

// Function to get distinct gradient-based color schemes based on post tags
function getTagColor(tag: string) {
  const norm = tag.toLowerCase();
  if (norm.includes("kube") || norm.includes("k8s") || norm.includes("cloud") || norm.includes("aws")) {
    return {
      text: "text-violet-500 dark:text-violet-400",
      bg: "bg-violet-500/10 dark:bg-violet-500/15",
      border: "border-violet-500/20 dark:border-violet-500/25",
      glow: "shadow-[0_0_12px_rgba(139,92,246,0.15)]",
    };
  }
  if (norm.includes("db") || norm.includes("database") || norm.includes("sql") || norm.includes("index") || norm.includes("postgres")) {
    return {
      text: "text-emerald-500 dark:text-emerald-400",
      bg: "bg-emerald-500/10 dark:bg-emerald-500/15",
      border: "border-emerald-500/20 dark:border-emerald-500/25",
      glow: "shadow-[0_0_12px_rgba(16,185,129,0.15)]",
    };
  }
  if (norm.includes("system") || norm.includes("design") || norm.includes("distrib")) {
    return {
      text: "text-pink-500 dark:text-pink-400",
      bg: "bg-pink-500/10 dark:bg-pink-500/15",
      border: "border-pink-500/20 dark:border-pink-500/25",
      glow: "shadow-[0_0_12px_rgba(236,72,153,0.15)]",
    };
  }
  if (norm.includes("backend") || norm.includes("api") || norm.includes("go") || norm.includes("rust")) {
    return {
      text: "text-orange-500 dark:text-orange-400",
      bg: "bg-orange-500/10 dark:bg-orange-500/15",
      border: "border-orange-500/20 dark:border-orange-500/25",
      glow: "shadow-[0_0_12px_rgba(249,115,22,0.15)]",
    };
  }
  // Default fallback
  return {
    text: "text-accent",
    bg: "bg-accent/10",
    border: "border-accent/20",
    glow: "shadow-[0_0_12px_rgba(139,92,246,0.15)]",
  };
}

export function BlogCard({ post }: BlogCardProps) {
  const firstTag = post.tags?.[0] || "Editorial";
  const colors = getTagColor(firstTag);

  return (
    <article className="group flex flex-col h-full genz-glass genz-glow p-4 lg:p-5 rounded-[2rem] transition-all duration-500 hover:-translate-y-1 relative overflow-hidden">
      {/* Subtle gradient background on hover */}
      <div className="absolute inset-0 bg-glow-subtle opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[2rem] pointer-events-none"></div>
      
      {/* Premium Image Frame */}
      {post.image ? (
        <Link href={`/blog/${post.slug}`} className="block relative aspect-[16/9] w-full bg-muted mb-6 overflow-hidden rounded-[1.5rem] border border-accent/10 group/image z-10">
          <Image 
            src={post.image} 
            alt={post.title} 
            fill 
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-1000 ease-out group-hover:scale-[1.04]" 
          />
          {/* Gradient Overlay on Hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-accent/25 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-10"></div>
        </Link>
      ) : (
        <div className="block relative aspect-[16/9] w-full bg-muted mb-5 overflow-hidden rounded-2xl border border-accent/10 z-10">
           <div className="absolute inset-0 bg-glow-subtle"></div>
        </div>
      )}
      
      {/* Details Container */}
      <div className="flex flex-col flex-1 px-2 relative z-10">
        <span className={`w-fit text-[10px] font-bold uppercase tracking-[0.15em] px-2.5 py-1 rounded-full border mb-4 ${colors.text} ${colors.bg} ${colors.border} ${colors.glow}`}>
          {firstTag.replace(/-/g, " ")}
        </span>
        
        <Link href={`/blog/${post.slug}`}>
          <h3 className="text-[19px] lg:text-[21px] font-extrabold font-heading text-text-primary leading-tight tracking-[-0.02em] mb-2 transition-colors duration-300 text-balance">
            {post.title}
          </h3>
        </Link>
        
        {post.description && (
          <p className="text-[14px] text-text-secondary leading-[1.6] mb-6 flex-1 line-clamp-2 font-medium">
            {post.description}
          </p>
        )}
        
        {/* Meta Row */}
        <div className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-wider text-text-tertiary pt-4 border-t border-accent/10 mt-auto">
          <time dateTime={post.date}>
            {new Date(post.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
          </time>
          <span className="text-accent/30">·</span>
          <span className="flex items-center gap-1">
            <svg className="w-3 h-3 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
            </svg>
            {post.readingTime}
          </span>
        </div>
      </div>
    </article>
  );
}
