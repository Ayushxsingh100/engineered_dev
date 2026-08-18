import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getAllPosts, getPostBySlug, getRelatedPosts, getAuthorBio } from "@/lib/firebaseServer";
import { compileMDX } from "@/lib/mdx";
import { SITE_URL, AUTHOR_NAME } from "@/lib/constants";
import { TableOfContents } from "@/components/TableOfContents";
import { BlogCard } from "@/components/BlogCard";
import { ShareButtons } from "@/components/ShareButtons";

export const revalidate = 60;

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  const ogImage = post.image || `${SITE_URL}/og-image.png`;

  return {
    title: post.title,
    description: post.description,
    keywords: post.tags,
    authors: [{ name: post.author || AUTHOR_NAME }],
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.date,
      authors: [post.author || AUTHOR_NAME],
      url: `${SITE_URL}/blog/${post.slug}`,
      tags: post.tags,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: [ogImage],
    },
    alternates: {
      canonical: `${SITE_URL}/blog/${post.slug}`,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const authorBio = post.authorId ? await getAuthorBio(post.authorId) : "";

  const { content, headings } = await compileMDX(post.content);
  const relatedPosts = await getRelatedPosts(slug);
  const allPosts = await getAllPosts();
  
  const currentIndex = allPosts.findIndex((p) => p.slug === slug);
  const prevPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null;
  const nextPost = currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;

  const formattedDate = new Date(post.date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "description": post.description,
    "datePublished": post.date,
    "author": [{
      "@type": "Person",
      "name": post.author || AUTHOR_NAME
    }],
    "image": post.image ? [post.image] : [],
    "url": `${SITE_URL}/blog/${post.slug}`
  };

  return (
    <article className="pt-24 sm:pt-32 pb-32 bg-background min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      {/* Editorial Header */}
      <header className="max-w-[720px] mx-auto px-6 mb-16 text-center">
        <div className="mb-6 flex justify-center">
          <Link href="/blog">
            <span className="bg-accent/10 border border-accent/20 text-accent text-[11px] font-bold uppercase tracking-widest px-4.5 py-1.5 rounded-full hover:bg-accent hover:text-white transition-all duration-300 shadow-[0_0_12px_rgba(139,92,246,0.1)]">
              {post.tags?.[0]?.replace(/-/g, " ") || "Editorial"}
            </span>
          </Link>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-heading text-foreground tracking-tight leading-tight mb-8 text-balance">
          {post.title}
        </h1>
        
        {post.description && (
          <p className="text-lg text-muted-foreground leading-relaxed max-w-[600px] mx-auto mb-10 text-pretty font-semibold">
            {post.description}
          </p>
        )}

        <div className="flex flex-wrap items-center justify-center gap-y-4 gap-x-6 text-[13px] text-text-secondary pt-8 border-t border-accent/10 max-w-[500px] mx-auto">
          {/* Author info with avatar */}
          <div className="flex items-center gap-2.5">
            {post.authorAvatar ? (
              <Image src={post.authorAvatar} alt={post.author || AUTHOR_NAME} width={32} height={32} className="rounded-full border border-accent/20 object-cover w-8 h-8" />
            ) : (
              <div className="w-8 h-8 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center font-bold text-accent shadow-inner text-[12px]">
                {post.author ? post.author.split(' ').map((n: string) => n[0]).join('') : AUTHOR_NAME.split(' ').map((n: string) => n[0]).join('')}
              </div>
            )}
            <span className="font-bold text-text-primary">
              By {post.author || AUTHOR_NAME}
            </span>
          </div>
          
          <span className="text-accent/30 hidden sm:inline">·</span>
          
          {/* Date info */}
          <div className="flex items-center gap-1.5 font-semibold">
            <svg className="w-4 h-4 text-accent/70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
            </svg>
            <time dateTime={post.date}>{formattedDate}</time>
          </div>
          
          <span className="text-accent/30 hidden sm:inline">·</span>

          {/* Reading time info */}
          <div className="flex items-center gap-1.5 font-semibold">
            <svg className="w-3.5 h-3.5 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
            </svg>
            <span>{post.readingTime}</span>
          </div>
        </div>
      </header>

      {/* Hero Image */}
      {post.image && (
        <div className="max-w-6xl mx-auto px-6 mb-20 w-full">
          <div className="aspect-[21/9] w-full relative bg-muted rounded-[2rem] overflow-hidden border border-border/50 shadow-sm">
            <Image
              src={post.image}
              alt={post.title}
              fill
              priority
              className="object-cover"
            />
          </div>
        </div>
      )}

      {/* Prose Content Grid */}
      <div className="max-w-[1040px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Left Side: Main content */}
        <div className="lg:col-span-8">
          <div className="prose w-full max-w-none">
            {content}
          </div>

          {/* Author Bio Box */}
          <div className="mt-16 p-6 sm:p-8 genz-glass genz-glow rounded-3xl border border-accent/15 flex flex-col sm:flex-row gap-6 items-center sm:items-start text-center sm:text-left relative overflow-hidden group">
            <div className="absolute inset-0 bg-glow-subtle opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl pointer-events-none"></div>
            
            {post.authorAvatar ? (
              <Image src={post.authorAvatar} alt={post.author || AUTHOR_NAME} width={64} height={64} className="rounded-full border border-accent/20 object-cover shrink-0 relative z-10 w-16 h-16" />
            ) : (
              <div className="w-16 h-16 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center font-bold text-accent shadow-inner text-2xl shrink-0 relative z-10">
                {post.author ? post.author.split(' ').map((n: string) => n[0]).join('') : AUTHOR_NAME.split(' ').map((n: string) => n[0]).join('')}
              </div>
            )}

            <div className="space-y-2 relative z-10">
              <h4 className="text-base font-bold font-heading text-text-primary">
                Published by <span className="genz-gradient-text">{post.author || AUTHOR_NAME}</span>
              </h4>
              <p className="text-sm text-text-secondary font-semibold leading-relaxed">
                {authorBio || "Software engineer focused on cloud computing, distributed systems, and scalable backend architecture. Writing about what I build and learn along the way."}
              </p>
            </div>
          </div>

          {/* Footer / Navigation */}
          <footer className="mt-16 pt-12 border-t border-accent/10">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div>
                {prevPost && (
                  <Link
                    href={`/blog/${prevPost.slug}`}
                    className="group relative flex flex-col gap-2 p-6 genz-glass genz-glow rounded-[2rem] transition-all duration-500 ease-out hover:-translate-y-1 hover:border-accent/30 h-full border border-accent/15 overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-glow-subtle opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-[2rem]"></div>
                    <div className="flex items-center gap-1.5 text-accent text-[10px] font-bold uppercase tracking-widest relative z-10">
                      <svg className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                      </svg>
                      {"// Previous Dispatch"}
                    </div>
                    <span className="text-[16px] font-bold font-heading text-text-primary group-hover:text-accent transition-colors duration-300 leading-snug text-balance relative z-10 mt-1">
                      {prevPost.title}
                    </span>
                  </Link>
                )}
              </div>
              <div>
                {nextPost && (
                  <Link
                    href={`/blog/${nextPost.slug}`}
                    className="group relative flex flex-col gap-2 p-6 genz-glass genz-glow rounded-[2rem] transition-all duration-500 ease-out hover:-translate-y-1 hover:border-accent/30 h-full sm:text-right sm:items-end border border-accent/15 overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-glow-subtle opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-[2rem]"></div>
                    <div className="flex items-center gap-1.5 text-accent text-[10px] font-bold uppercase tracking-widest relative z-10 sm:flex-row-reverse">
                      <svg className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                      </svg>
                      {"// Next Dispatch"}
                    </div>
                    <span className="text-[16px] font-bold font-heading text-text-primary group-hover:text-accent transition-colors duration-300 leading-snug text-balance relative z-10 mt-1">
                      {nextPost.title}
                    </span>
                  </Link>
                )}
              </div>
            </div>
          </footer>

          {/* Related Articles */}
          {relatedPosts.length > 0 && (
            <div className="mt-16 pt-12 border-t border-accent/10">
              <h3 className="text-2xl font-extrabold font-heading text-text-primary mb-8 flex items-center gap-3">
                <span className="text-accent">{"//"}</span> Continue Reading
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {relatedPosts.slice(0, 2).map(rp => (
                  <BlogCard key={rp.slug} post={rp} />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Side: Sticky outline/widgets */}
        <aside className="hidden lg:block lg:col-span-4">
          <div className="sticky top-28 space-y-8">
            <div className="genz-glass genz-glow p-6 rounded-2xl border border-accent/15">
              <TableOfContents headings={headings} />
            </div>
            
            {/* Quick newsletter signup */}
            <div className="genz-glass genz-glow p-6 rounded-2xl border border-accent/15 space-y-4">
              <h4 className="text-[10px] font-mono font-bold uppercase tracking-widest text-accent">
                Newsletter
              </h4>
              <p className="text-xs text-text-secondary font-semibold leading-relaxed">
                Stay updated with the latest dispatches on cloud architecture and distributed database plumbing.
              </p>
              <Link href="/#newsletter" className="genz-btn-gradient block text-center py-2 rounded-full text-xs font-bold text-white shadow-md">
                Subscribe
              </Link>
            </div>

            {/* Social Share */}
            <div className="genz-glass genz-glow p-6 rounded-2xl border border-accent/15">
              <ShareButtons title={post.title} url={`${SITE_URL}/blog/${post.slug}`} />
            </div>
          </div>
        </aside>

      </div>

    </article>
  );
}
