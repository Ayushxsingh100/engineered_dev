import Link from "next/link";
import type { Project } from "@/lib/projects";

interface ProjectCardProps {
  project: Project;
}

function getCategoryIcon(category: string, className = "w-5 h-5 text-accent") {
  const norm = category?.toLowerCase() || "";
  if (norm.includes("cloud") || norm.includes("infra")) {
    return (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15a4.5 4.5 0 004.5 4.5H18a3.75 3.75 0 001.332-7.257 3 3 0 00-3.758-3.848 5.25 5.25 0 00-10.233 2.33A4.502 4.502 0 002.25 15z" />
      </svg>
    );
  }
  if (norm.includes("backend") || norm.includes("system") || norm.includes("api")) {
    return (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.43l-1.003.828c-.293.241-.438.613-.43.992a7.723 7.723 0 010 .255c-.008.378.137.75.43.992a7.722 7.722 0 010 .255c-.008.378.137.75.43.992l1.004.827c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.43l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.991l-1.004-.827a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.28z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    );
  }
  if (norm.includes("distributed") || norm.includes("network")) {
    return (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-.778.099-1.533.284-2.253m0 0L12 10.5" />
      </svg>
    );
  }
  if (norm.includes("data") || norm.includes("engineering")) {
    return (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v5.25c0 .621-.504 1.125-1.125 1.125h-2.25A1.125 1.125 0 013 18.375v-5.25zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125v-9.75zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v14.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
      </svg>
    );
  }
  if (norm.includes("devops") || norm.includes("ci") || norm.includes("cd")) {
    return (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    );
  }
  // default / fallback
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499c.175-.467.865-.467 1.04 0l2.223 5.927a.5.5 0 00.378.337l6.398.815c.504.064.706.69.324 1.037l-4.707 4.29a.5.5 0 00-.154.474l1.246 6.326c.098.502-.43.886-.87.625l-5.632-3.342a.5.5 0 00-.514 0l-5.632 3.342c-.44.261-.968-.123-.87-.625l1.246-6.326a.5.5 0 00-.154-.474l-4.707-4.29c-.382-.347-.18-.973.324-1.037l6.398-.815a.5.5 0 00.378-.337L11.48 3.499z" />
    </svg>
  );
}

export function ProjectCard({ project }: ProjectCardProps) {
  const {
    id,
    name,
    description,
    techStack,
    githubUrl,
    liveUrl,
    category,
  } = project;

  return (
    <article className="group flex flex-col h-full genz-glass genz-glow p-6 rounded-[2rem] transition-all duration-500 ease-out hover:-translate-y-1 hover:border-accent/30 relative overflow-hidden">
      {/* Gradient reveal on hover */}
      <div className="absolute inset-0 bg-glow-subtle opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[2rem] pointer-events-none"></div>
      
      {/* Top section */}
      <div className="flex items-start justify-between gap-4 mb-4 relative z-10">
        <div className="flex items-center gap-3">
          {/* Category icon */}
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-accent/10 border border-accent/20 select-none shadow-[0_0_15px_rgba(139,92,246,0.1)]">
            {getCategoryIcon(category ?? "")}
          </span>
          <div>
            <p className="text-[10px] font-mono font-bold text-text-tertiary uppercase tracking-widest">
              {category ?? "Project"}
            </p>
            <h3 className="text-[17px] font-extrabold font-heading tracking-[-0.02em] text-text-primary group-hover:text-accent transition-colors duration-300 leading-tight mt-1">
              <Link href={`/projects/${id}`}>{name}</Link>
            </h3>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-1.5 shrink-0">
          {githubUrl && githubUrl !== "#" && (
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center h-8 w-8 rounded-full border border-accent/20 text-text-secondary hover:text-accent hover:border-accent hover:shadow-[0_0_12px_rgba(139,92,246,0.2)] bg-accent/5 transition-all duration-300 hover:scale-105 active:scale-95"
              aria-label="View on GitHub"
            >
              <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2Z" />
              </svg>
            </a>
          )}
          {liveUrl && (
            <a
              href={liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center h-8 w-8 rounded-full border border-accent/20 text-text-secondary hover:text-accent hover:border-accent hover:shadow-[0_0_12px_rgba(139,92,246,0.2)] bg-accent/5 transition-all duration-300 hover:scale-105 active:scale-95"
              aria-label="Live demo"
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
              </svg>
            </a>
          )}
        </div>
      </div>

      {/* Description */}
      <p className="text-[13px] text-text-secondary leading-relaxed line-clamp-3 -mt-1 mb-4 font-medium relative z-10">
        {description}
      </p>

      {/* Tech stack */}
      <div className="flex flex-wrap gap-1.5 mb-6 relative z-10">
        {techStack.slice(0, 6).map((tech) => (
          <span
            key={tech}
            className="inline-flex items-center h-6 px-3 rounded-full text-[10px] font-mono font-semibold bg-accent/8 border border-accent/15 text-accent"
          >
            {tech}
          </span>
        ))}
        {techStack.length > 6 && (
          <span className="inline-flex items-center h-6 px-3 rounded-full text-[10px] font-mono font-semibold bg-accent/8 border border-accent/15 text-accent">
            +{techStack.length - 6}
          </span>
        )}
      </div>

      {/* Footer CTA */}
      <div className="mt-auto pt-4 border-t border-accent/10 relative z-10">
        <Link
          href={`/projects/${id}`}
          className="inline-flex items-center gap-1.5 text-[12px] font-bold text-accent hover:text-[var(--accent-secondary)] transition-colors duration-300 group/link"
        >
          View case study
          <svg className="h-3.5 w-3.5 group-hover/link:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
          </svg>
        </Link>
      </div>
    </article>
  );
}
