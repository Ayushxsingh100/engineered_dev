import Link from "next/link";
import Image from "next/image";
import { getAllPosts } from "@/lib/firebaseServer";
import { getFeaturedProjects } from "@/lib/projects";
import { NewsletterCTA } from "@/components/NewsletterCTA";
import { BlogCard } from "@/components/BlogCard";
import InfraVisual from "@/components/InfraVisual";

export const revalidate = 60; // revalidate every 60 seconds

const TOPICS = [
  { 
    name: "Cloud Engineering", 
    slug: "cloud-computing", 
    icon: (className: string) => (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15a4.5 4.5 0 004.5 4.5H18a3.75 3.75 0 001.332-7.257 3 3 0 00-3.758-3.848 5.25 5.25 0 00-10.233 2.33A4.502 4.502 0 002.25 15z" />
      </svg>
    ) 
  },
  { 
    name: "System Design",    
    slug: "system-design", 
    icon: (className: string) => (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H3.75A1.125 1.125 0 002.625 3.75v12a1.125 1.125 0 001.125 1.125h12a3.375 3.375 0 003.375-3.375z" />
      </svg>
    ) 
  },
  { 
    name: "Backend APIs",     
    slug: "backend", 
    icon: (className: string) => (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.43l-1.003.828c-.293.241-.438.613-.43.992a7.723 7.723 0 010 .255c-.008.378.137.75.43.992a7.722 7.722 0 010 .255c-.008.378.137.75.43.992l1.004.827c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.43l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.991l-1.004-.827a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.28z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ) 
  },
  { 
    name: "Distributed Sys",  
    slug: "distributed-systems", 
    icon: (className: string) => (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-.778.099-1.533.284-2.253m0 0L12 10.5" />
      </svg>
    ) 
  },
];

export default async function HomePage() {
  const allPosts = await getAllPosts();
  const featuredProjects = getFeaturedProjects();

  const featuredStory = allPosts[0];
  const editorsPicks = allPosts.length > 1 ? allPosts.slice(1, 4) : [];
  
  // If there are less than 5 posts, show the editors picks in the latest drops too so it doesn't look broken
  const latestArticles = allPosts.length > 4 
    ? allPosts.slice(4, 10) 
    : allPosts.slice(1, 4);
    
  const topProject = featuredProjects[0];

  return (
    <div className="pt-24 min-h-screen bg-background relative">
      
      {/* =========================================================================
         THE FEATURED STORY — GLASSMORPHISM HERO
         ========================================================================= */}
      {featuredStory && (
        <section className="max-w-[1400px] mx-auto px-6 lg:px-12 py-8 lg:py-12 animate-in fade-in slide-in-from-bottom-4 duration-1000 fill-mode-both">
          <div className="w-full genz-glass bg-glow-subtle rounded-[2.5rem] p-6 sm:p-8 lg:p-12 relative overflow-hidden group">
            {/* Decorative gradient orb */}
            <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-accent/10 blur-[80px] group-hover:bg-accent/20 transition-all duration-1000 pointer-events-none"></div>
            <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-[var(--accent-secondary)]/8 blur-[60px] pointer-events-none"></div>
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
              
              {/* Left Column */}
              <div className="lg:col-span-6 flex flex-col justify-center py-4">
                <div className="flex items-center gap-3 mb-6 text-[11px] font-bold uppercase tracking-[0.15em]">
                  <span className="genz-gradient-text">{featuredStory.tags?.[0]?.replace(/-/g, " ") || "Editorial"}</span>
                  <span className="text-muted-foreground/45">·</span>
                  <time dateTime={featuredStory.date} className="text-muted-foreground font-medium uppercase tracking-wider">
                    {new Date(featuredStory.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </time>
                </div>
                
                <Link href={`/blog/${featuredStory.slug}`}>
                  <h1 className="text-4xl lg:text-[2.75rem] font-extrabold font-heading text-foreground tracking-[-0.035em] leading-[1.05] mb-6 hover:text-accent transition-colors duration-300 text-balance">
                    {featuredStory.title}
                  </h1>
                </Link>
                
                <p className="text-[15px] lg:text-[17px] text-muted-foreground leading-[1.6] mb-8 max-w-lg font-medium text-balance">
                  {featuredStory.description}
                </p>
                
                <Link 
                  href={`/blog/${featuredStory.slug}`} 
                  className="genz-btn-gradient text-[14px] px-6 py-3 rounded-full w-fit inline-flex items-center gap-2 group/cta"
                >
                  Read full story <span className="group-hover/cta:translate-x-1 transition-transform">→</span>
                </Link>
              </div>

              {/* Right Column */}
              {featuredStory.image && (
                <div className="lg:col-span-6 h-[35vh] lg:h-[45vh] relative rounded-[2rem] overflow-hidden w-full border border-accent/10 shadow-[0_8px_30px_rgba(139,92,246,0.1)]">
                  <Link href={`/blog/${featuredStory.slug}`} className="block w-full h-full group/img">
                    <Image 
                      src={featuredStory.image} 
                      alt={featuredStory.title} 
                      fill 
                      priority 
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-cover object-center transition-transform duration-700 ease-out group-hover/img:scale-[1.03]" 
                    />
                    {/* Gradient overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-accent/20 via-transparent to-transparent opacity-0 group-hover/img:opacity-100 transition-opacity duration-500"></div>
                  </Link>
                </div>
              )}

            </div>
          </div>
        </section>
      )}

      {/* =========================================================================
         DISCOVERY BENTO GRID — LATEST DROPS & SIDEBAR
         ========================================================================= */}
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-8 lg:py-12 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 border-t border-accent/10 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200 fill-mode-both">
        
        {/* Left Column: Latest Articles */}
        <div className="lg:col-span-8">
          <div className="flex items-center justify-between pb-4 mb-8 border-b border-accent/10">
            <h2 className="text-xl font-bold font-heading tracking-tight text-foreground flex items-center gap-2">
              Latest Drops
              <svg className="w-5 h-5 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
              </svg>
            </h2>
            <Link href="/blog" className="text-xs font-bold text-accent hover:text-[var(--accent-secondary)] transition-colors duration-200 flex items-center gap-1">
              Archive <span>→</span>
            </Link>
          </div>
          
          {latestArticles.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-12">
              {latestArticles.map((post) => (
                <BlogCard key={post.slug} post={post} />
              ))}
            </div>
          ) : (
            <div className="py-12 text-center border border-dashed border-accent/20 rounded-3xl genz-glass">
              <p className="text-text-secondary font-medium">No drops yet. Check back soon!</p>
            </div>
          )}
        </div>

        {/* Right Column: Sidebar Widgets */}
        <aside className="lg:col-span-4 space-y-8">
          
          {/* Topics widget */}
          <div className="genz-glass genz-glow p-6 rounded-[2rem]">
            <h2 className="text-[11px] font-bold uppercase tracking-[0.15em] text-muted-foreground mb-5 border-b border-accent/10 pb-3 flex items-center gap-2">
              Explore Topics
              <svg className="w-3.5 h-3.5 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
                <path d="m5 3 1 2.5L8.5 6 6 7 5 9.5 4 7 1.5 6 4 5 5 3Z" />
                <path d="m19 17 1 2.5 2.5.5-2.5 1-1 2.5-1-2.5-2.5-1 2.5-1 1-2.5Z" />
              </svg>
            </h2>
            <div className="flex flex-wrap gap-2.5">
              {TOPICS.map(topic => (
                <Link 
                  key={topic.slug} 
                  href={`/blog?tag=${topic.slug}`} 
                  className="group bg-surface text-text-secondary text-[13px] font-medium px-3.5 py-2 rounded-xl border border-border hover:border-text-tertiary transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm flex items-center gap-2"
                >
                  <span className="text-muted-foreground group-hover:text-foreground transition-colors">
                    {topic.icon("w-4 h-4")}
                  </span>
                  <span className="group-hover:text-foreground transition-colors">
                    {topic.name}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* Editor's Picks */}
          <div className="genz-glass genz-glow p-6 rounded-[2rem]">
            <h2 className="text-[11px] font-bold uppercase tracking-[0.15em] text-muted-foreground mb-5 border-b border-accent/10 pb-3 flex items-center gap-2">
              Hot Picks
              <svg className="w-3.5 h-3.5 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
              </svg>
            </h2>
            <div className="flex flex-col gap-6">
              {editorsPicks.map((post) => (
                <article key={post.slug} className="group flex gap-4 items-start pb-4 border-b border-accent/10 last:border-b-0 last:pb-0">
                  {post.image && (
                    <div className="w-16 h-16 relative shrink-0 rounded-2xl overflow-hidden border border-accent/15 shadow-sm">
                      <Image src={post.image} alt={post.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
                    </div>
                  )}
                  <div className="flex-1">
                    <span className="block text-[10px] font-bold uppercase tracking-wider genz-gradient-text mb-1">
                      {post.tags?.[0]?.replace(/-/g, " ") || "Editorial"}
                    </span>
                    <Link href={`/blog/${post.slug}`}>
                      <h3 className="text-[14px] font-bold font-heading text-foreground leading-snug transition-colors duration-200 mb-1 text-balance">
                        {post.title}
                      </h3>
                    </Link>
                    <time dateTime={post.date} className="text-[10px] font-medium text-muted-foreground">
                      {new Date(post.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </time>
                  </div>
                </article>
              ))}
            </div>
          </div>

          
        </aside>
      </div>

      {/* =========================================================================
         FEATURED PROJECT — GRADIENT DARK KEYNOTE SPREAD
         ========================================================================= */}
      {topProject && (
        <section className="max-w-[1400px] mx-auto px-6 lg:px-12 mb-16 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300 fill-mode-both">
          <div className="bg-[#0e0e24] text-zinc-100 p-8 lg:p-16 rounded-[2.5rem] overflow-hidden shadow-[0_24px_80px_-12px_rgba(139,92,246,0.2)] relative group/keynote border border-accent/10">
            {/* Animated Gradient Sweep on Hover */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_var(--mouse-x,50%)_var(--mouse-y,50%),_var(--color-accent)_0%,_transparent_50%)] opacity-0 group-hover/keynote:opacity-[0.08] transition-opacity duration-1000 pointer-events-none mix-blend-screen"></div>
            {/* Decorative blobs */}
            <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-accent/10 blur-[100px] pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-[var(--accent-secondary)]/8 blur-[80px] pointer-events-none"></div>
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
              
              {/* Left Column */}
              <div className="lg:col-span-7">
                <span className="inline-block text-[11px] font-bold uppercase tracking-widest genz-gradient-text mb-4">
                  {"// Engineering Case Study"}
                </span>
                <h2 className="text-3xl lg:text-5xl font-extrabold font-heading tracking-tight text-zinc-50 mb-4 text-balance leading-tight">
                  {topProject.name}
                </h2>
                <p className="text-sm lg:text-base text-zinc-400 leading-relaxed mb-8 max-w-md font-medium">
                  {topProject.description}
                </p>
                <Link 
                  href={`/projects/${topProject.id}`} 
                  className="genz-btn-gradient inline-flex items-center gap-2 text-[13px] font-bold px-7 py-3.5 rounded-full cursor-pointer group/btn"
                >
                  Read Case Study
                  <svg className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                  </svg>
                </Link>
              </div>
              
              {/* Right Column */}
              <div className="lg:col-span-5 aspect-[4/3] w-full relative overflow-hidden">
                 <InfraVisual />
              </div>

            </div>
          </div>
        </section>
      )}

      {/* =========================================================================
         NEWSLETTER — VIBRANT SUBSCRIBE CARD
         ========================================================================= */}
      <section className="border-t border-accent/10 py-16 bg-glow-subtle animate-in fade-in duration-1000 delay-500 fill-mode-both">
        <div className="max-w-4xl mx-auto px-6 flex justify-center">
          <NewsletterCTA />
        </div>
      </section>

    </div>
  );
}
