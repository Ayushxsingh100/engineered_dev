import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getAllProjects, getProjectBySlug } from "@/lib/firebaseServer";
import { compileMDX } from "@/lib/mdx";
import { AUTHOR_NAME } from "@/lib/constants";

export const revalidate = 60;

export async function generateStaticParams() {
  const projects = await getAllProjects();
  return projects.map((project) => ({
    slug: project.slug || project.id,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    return {
      title: "Project Not Found",
    };
  }

  return {
    title: `${project.name} — Case Study`,
    description: project.description,
    authors: [{ name: AUTHOR_NAME }],
  };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  // Compile MDX blocks in parallel
  const [
    archMdx,
    scaleMdx,
    implMdx,
    lessonsMdx,
  ] = await Promise.all([
    compileMDX(project.architecture || ""),
    compileMDX(project.scalability || ""),
    compileMDX(project.implementation || ""),
    compileMDX(project.lessonsLearned || ""),
  ]);

  const allProjects = await getAllProjects();
  const currentIndex = allProjects.findIndex((p) => (p.slug || p.id) === slug);
  const prevProject = currentIndex > 0 ? allProjects[currentIndex - 1] : null;
  const nextProject = currentIndex < allProjects.length - 1 ? allProjects[currentIndex + 1] : null;

  // Resolve illustration URL
  let illustrationUrl = "";
  if (project.id === "cloud-native-api-gateway") {
    illustrationUrl = "/images/cloud_native_case_study.png";
  } else if (project.id === "distributed-task-queue") {
    illustrationUrl = "/images/task_queue_case_study.png";
  }

  return (
    <article className="pt-24 sm:pt-32 pb-32 bg-background min-h-screen">
      {/* Back link */}
      <div className="max-w-[1040px] mx-auto px-6 mb-10">
        <Link
          href="/projects"
          className="inline-flex items-center text-[11px] font-bold uppercase tracking-widest text-text-tertiary hover:text-accent transition-colors gap-1.5"
        >
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
          </svg>
          Back to Projects
        </Link>
      </div>

      <header className="max-w-[720px] mx-auto px-6 mb-16 text-center">
        <div className="mb-6 flex justify-center">
          <span className="bg-accent/10 border border-accent/20 text-accent text-[11px] font-bold uppercase tracking-widest px-4.5 py-1.5 rounded-full shadow-[0_0_12px_rgba(139,92,246,0.1)]">
            {project.category}
          </span>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-heading text-foreground tracking-tight leading-tight mb-8 text-balance">
          {project.name}
        </h1>
        
        <div className="flex flex-wrap items-center justify-center gap-y-4 gap-x-6 text-[13px] text-text-secondary pt-8 border-t border-accent/10 max-w-[500px] mx-auto">
          {/* Author info with avatar */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center font-bold text-accent shadow-inner text-[12px]">
              {AUTHOR_NAME.split(' ').map((n: string) => n[0]).join('')}
            </div>
            <span className="font-bold text-text-primary">
              By {AUTHOR_NAME}
            </span>
          </div>
          
          {project.publishedAt && (
            <>
              <span className="text-accent/30 hidden sm:inline">·</span>
              <div className="flex items-center gap-1.5 font-semibold">
                <svg className="w-4 h-4 text-accent/70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                </svg>
                <time>{new Date(project.publishedAt).toLocaleDateString("en-US", { year: "numeric", month: "long" })}</time>
              </div>
            </>
          )}
        </div>

        {/* Tech Stack & Links */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-6">
          <div className="flex flex-wrap justify-center gap-2">
            {project.techStack.map((tech) => (
              <span
                key={tech}
                className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full bg-accent/10 border border-accent/20 text-accent"
              >
                {tech}
              </span>
            ))}
          </div>

          {(project.githubUrl || project.liveUrl) && (
            <div className="flex items-center justify-center gap-3 border-t sm:border-t-0 sm:border-l border-accent/10 pt-4 sm:pt-0 sm:pl-6 w-full sm:w-auto">
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center px-4 py-2 border border-accent/20 rounded-full text-xs font-bold uppercase tracking-wider text-text-primary hover:text-accent hover:border-accent hover:bg-accent/5 transition-colors gap-1.5 shadow-sm"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482C19.138 20.197 22 16.44 22 12.017 22 6.484 17.522 2 12 2z" />
                  </svg>
                  Repository
                </a>
              )}
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="genz-btn-gradient inline-flex items-center justify-center px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider gap-1.5 shadow-md"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                  </svg>
                  Live Demo
                </a>
              )}
            </div>
          )}
        </div>
      </header>

      {/* Hero Illustration */}
      {illustrationUrl && (
        <div className="max-w-6xl mx-auto px-6 mb-20 w-full">
          <div className="aspect-[21/9] w-full relative bg-muted rounded-[2rem] overflow-hidden border border-accent/15 shadow-sm group">
            <div className="absolute inset-0 bg-glow-subtle opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 pointer-events-none"></div>
            <Image
              src={illustrationUrl}
              alt={`${project.name} Architecture Diagram`}
              fill
              className="object-cover transition-transform duration-1000 ease-out group-hover:scale-[1.02]"
            />
          </div>
        </div>
      )}

      {/* Grid Layout for Content */}
      <div className="max-w-[1040px] mx-auto px-6">
        <div className="space-y-16">
          
          {/* SECTION I: Abstract */}
          <section className="genz-glass genz-glow p-8 md:p-12 rounded-[2rem] border border-accent/15">
            <h2 className="text-sm font-bold uppercase tracking-widest genz-gradient-text mb-6">
              I. Executive Summary
            </h2>
            <p className="text-xl font-medium leading-relaxed text-text-primary text-pretty">
              {project.description}
            </p>
          </section>

          {/* Prose Content */}
          <div className="prose w-full max-w-none">
            {/* Architecture */}
            {project.architecture && (
              <section className="mb-12">
                <h2 className="text-2xl font-extrabold font-heading text-text-primary mb-6 flex items-center gap-3">
                  <span className="text-accent">II.</span> Architecture Design
                </h2>
                {archMdx.content}
              </section>
            )}

            {/* Implementation */}
            {project.implementation && project.implementation.trim() !== "" && (
              <section className="mb-12">
                <h2 className="text-2xl font-extrabold font-heading text-text-primary mb-6 flex items-center gap-3">
                  <span className="text-accent">III.</span> Core Implementation
                </h2>
                {implMdx.content}
              </section>
            )}

            {/* Challenges */}
            {project.challenges && project.challenges.length > 0 && (
              <section className="mb-12">
                <h2 className="text-2xl font-extrabold font-heading text-text-primary mb-6 flex items-center gap-3">
                  <span className="text-accent">IV.</span> Engineering Challenges
                </h2>
                <div className="grid gap-4 not-prose">
                  {project.challenges.map((challenge, idx) => (
                    <div key={idx} className="flex gap-4 p-5 rounded-2xl border border-accent/10 bg-accent/5 hover:bg-accent/10 transition-colors">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent/20 text-accent font-bold flex items-center justify-center text-sm shadow-inner">
                        {idx + 1}
                      </div>
                      <p className="text-text-secondary font-medium leading-relaxed m-0 text-[15px]">
                        {challenge}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Scalability */}
            {project.scalability && project.scalability.trim() !== "" && (
              <section className="mb-12">
                <h2 className="text-2xl font-extrabold font-heading text-text-primary mb-6 flex items-center gap-3">
                  <span className="text-accent">V.</span> Scalability Analysis
                </h2>
                {scaleMdx.content}
              </section>
            )}

            {/* Lessons */}
            {project.lessonsLearned && project.lessonsLearned.trim() !== "" && (
              <section className="mb-12">
                <h2 className="text-2xl font-extrabold font-heading text-text-primary mb-6 flex items-center gap-3">
                  <span className="text-accent">VI.</span> Operational Lessons
                </h2>
                {lessonsMdx.content}
              </section>
            )}
          </div>
        </div>

        {/* Navigation */}
        <footer className="mt-24 pt-12 border-t border-accent/10">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div>
              {prevProject && (
                <Link
                  href={`/projects/${prevProject.slug || prevProject.id}`}
                  className="group flex flex-col gap-2 p-6 bg-background shadow-[0_0_20px_rgba(139,92,246,0.05)] rounded-[2rem] transition-all duration-300 h-full border border-accent/10 hover:border-accent hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(139,92,246,0.15)]"
                >
                  <span className="text-[10px] font-bold uppercase tracking-widest text-accent flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                    </svg>
                    Previous Project
                  </span>
                  <span className="text-[17px] font-bold font-heading text-text-primary group-hover:text-accent transition-colors leading-snug text-balance mt-1">
                    {prevProject.name}
                  </span>
                </Link>
              )}
            </div>
            <div>
              {nextProject && (
                <Link
                  href={`/projects/${nextProject.slug || nextProject.id}`}
                  className="group flex flex-col gap-2 p-6 bg-background shadow-[0_0_20px_rgba(139,92,246,0.05)] rounded-[2rem] transition-all duration-300 h-full sm:text-right sm:items-end border border-accent/10 hover:border-accent hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(139,92,246,0.15)]"
                >
                  <span className="text-[10px] font-bold uppercase tracking-widest text-accent flex items-center gap-1.5 justify-end">
                    Next Project
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                  </span>
                  <span className="text-[17px] font-bold font-heading text-text-primary group-hover:text-accent transition-colors leading-snug text-balance mt-1">
                    {nextProject.name}
                  </span>
                </Link>
              )}
            </div>
          </div>
        </footer>
      </div>
    </article>
  );
}
