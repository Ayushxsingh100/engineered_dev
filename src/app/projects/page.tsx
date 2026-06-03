import type { Metadata } from "next";
import { getAllProjects } from "@/lib/firebaseServer";
import { ProjectCard } from "@/components/ProjectCard";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Engineering projects — distributed systems, cloud infrastructure, backend services, and open-source tools.",
};

export default async function ProjectsPage() {
  const projects = await getAllProjects();

  return (
    <div className="pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-5 sm:px-6">
        {/* Page header */}
        <div className="mb-12 space-y-3">
          <div className="flex items-center gap-3">
            <span className="h-1 w-8 rounded-full" style={{ background: 'linear-gradient(90deg, #8b5cf6, #ec4899, #f97316)' }} />
            <span className="text-[10px] font-bold uppercase tracking-widest genz-gradient-text">Projects</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold font-heading tracking-tight text-text-primary flex items-center gap-2.5">
            Things I&apos;ve built
            <svg className="w-8 h-8 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 0M12 16.25v2m-3.5 1.75a2 2 0 003.5-1.75H12a2 2 0 003.5 1.75M12 3c-1.2 2-3.5 6-3.5 9v3.5a1 1 0 001 1h5a1 1 0 001-1V12c0-3-2.3-7-3.5-9z" />
            </svg>
          </h1>
          <p className="text-base text-text-secondary leading-relaxed max-w-xl">
            A collection of engineering projects across distributed systems, cloud infrastructure,
            and backend tooling — with architecture notes and design decisions.
          </p>
        </div>

        {projects.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <div className="genz-glass rounded-2xl p-12 text-center space-y-2">
            <p className="text-base font-medium text-text-primary flex items-center justify-center gap-2">
              No projects yet
              <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h18v3H3V3z" />
              </svg>
            </p>
            <p className="text-sm text-text-secondary">
              Projects are being compiled. Check back soon.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
