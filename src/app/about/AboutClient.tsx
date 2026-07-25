"use client";

import Image from "next/image";
import Link from "next/link";

interface AuthorData {
  name: string;
  role: string;
  image?: string;
  intro1: string;
  intro2: string;
  socials: {
    github: string;
    twitter: string;
    linkedin: string;
  };
  interests: { title: string; description: string }[];
  skills: Record<string, string[]>;
  philosophy1: string;
  philosophy2: string;
  goals: string[];
  quote?: string;
}

const AUTHORS: Record<string, AuthorData> = {
  "Ayush Singh": {
    name: "Ayush Singh",
    role: "Computer Science Student & Technical Writer",
    image: "/images/ayush.png",
    intro1: "Hi, I'm Ayush Singh — a Computer Science student passionate about Cloud Computing, Backend Engineering, System Design, and Scalable Software Systems.",
    intro2: "Engineered is my personal engineering journal where I document concepts I learn, technologies I explore, projects I build, and ideas that shape my understanding of modern software engineering. My goal is not just to learn technologies, but to understand how real-world systems are designed, scaled, and maintained. Through this platform, I share practical insights, architecture breakdowns, engineering observations, and lessons from my ongoing journey as a student developer.",
    socials: {
      github: "https://github.com/Ayushxsingh100",
      twitter: "https://twitter.com/Ayushxsingh100",
      linkedin: "https://www.linkedin.com/in/ayush-kumar-singh-b46468342/",
    },
    interests: [
      {
        title: "Cloud Computing",
        description: "Exploring cloud-native architectures, serverless computing, and building infrastructure on AWS and Google Cloud."
      },
      {
        title: "Backend Engineering",
        description: "Building robust REST APIs and scalable web services using Spring Boot and Node.js."
      },
      {
        title: "System Design",
        description: "Understanding distributed systems, scalable architectures, and how technology works at scale."
      }
    ],
    skills: {
      "Languages": ["Java", "JavaScript", "SQL"],
      "Cloud & Infrastructure": ["AWS (EC2, S3, Lambda)", "Google Cloud (Learning)"],
      "Backend Development": ["Spring Boot", "Node.js", "REST APIs"],
      "Databases": ["MySQL", "MongoDB"],
      "Developer Tools": ["Git", "GitHub", "Linux/Terminal", "Vercel"],
    },
    philosophy1: "I believe the best way to learn engineering is to build, experiment, question assumptions, and explain concepts clearly.",
    philosophy2: "Every article published on Engineered represents a genuine learning experience, technical exploration, project insight, or engineering observation. Rather than chasing trends, the focus is on developing a deeper understanding of modern software systems and sharing that journey openly.",
    goals: [
      "Build strong expertise in Cloud and Backend Engineering.",
      "Develop a solid understanding of scalable and distributed systems.",
      "Explore modern architecture patterns and cloud-native technologies.",
      "Document my engineering growth consistently through technical writing.",
      "Create a valuable resource for students and aspiring software engineers.",
      "Grow into an engineer capable of designing reliable, scalable, and impactful systems."
    ],
    quote: "Engineering is not just about writing code — it's about understanding systems, solving problems thoughtfully, and continuously learning how technology works at scale."
  }
};

interface OtherAuthor {
  name: string;
  role: string;
  avatar: string;
  slug: string;
  isPlaceholder?: boolean;
}

const otherAuthors: OtherAuthor[] = [
  {
    name: "Krishika",
    role: "Technical Writer",
    avatar: "/images/krishika.jpg",
    slug: "krishika",
    isPlaceholder: false
  },
  {
    name: "Future Author",
    role: "Coming Soon",
    avatar: "",
    slug: "",
    isPlaceholder: true
  },
  {
    name: "Future Author",
    role: "Coming Soon",
    avatar: "",
    slug: "",
    isPlaceholder: true
  },
  {
    name: "Future Author",
    role: "Coming Soon",
    avatar: "",
    slug: "",
    isPlaceholder: true
  }
];

const CATEGORY_COLORS: Record<string, string> = {
  Languages: "bg-violet-500/10 text-violet-500 border-violet-500/20",
  "Cloud & Infrastructure": "bg-pink-500/10 text-pink-500 border-pink-500/20",
  "Backend Development": "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  Databases: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  "Developer Tools": "bg-orange-500/10 text-orange-500 border-orange-500/20",
  Frameworks: "bg-rose-500/10 text-rose-500 border-rose-500/20",
  Design: "bg-amber-500/10 text-amber-500 border-amber-500/20",
};

export default function AboutClient() {
  const author = AUTHORS["Ayush Singh"];

  return (
    <section className="py-12 sm:py-20 bg-surface relative">
      <div className="max-w-4xl mx-auto px-6">

        <div key={author.name} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          
          {/* Editorial Heading */}
          <div className="mb-16 pb-8 relative">
            <div className="h-1 w-20 rounded-full mb-6" style={{ background: 'linear-gradient(90deg, #8b5cf6, #ec4899, #f97316)' }}></div>
            <span className="text-[10px] font-mono tracking-widest uppercase font-bold genz-gradient-text block mb-3">
              BIOGRAPHICAL LOG
            </span>
            <h1 className="text-3xl sm:text-5xl font-heading font-extrabold tracking-tight text-text-primary mb-4">
              About <span className="genz-gradient-text">{author.name}</span>
            </h1>

            <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 mb-6">
              <p className="text-sm font-mono text-text-tertiary uppercase flex items-center gap-1.5">
                {author.role}
                <svg className="w-3.5 h-3.5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 0M12 16.25v2m-3.5 1.75a2 2 0 003.5-1.75H12a2 2 0 003.5 1.75M12 3c-1.2 2-3.5 6-3.5 9v3.5a1 1 0 001 1h5a1 1 0 001-1V12c0-3-2.3-7-3.5-9z" />
                </svg>
              </p>

              {/* Social Links */}
              <div className="flex items-center gap-3">
                <a href={author.socials.github} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-surface-alt border border-border text-text-secondary hover:text-accent hover:border-accent/30 transition-all">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482C19.138 20.197 22 16.44 22 12.017 22 6.484 17.522 2 12 2z" /></svg>
                </a>
                <a href={author.socials.twitter} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-surface-alt border border-border text-text-secondary hover:text-accent hover:border-accent/30 transition-all">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" /></svg>
                </a>
                <a href={author.socials.linkedin} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-surface-alt border border-border text-text-secondary hover:text-accent hover:border-accent/30 transition-all">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
                </a>
              </div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, var(--accent), transparent)' }}></div>
          </div>

          {/* Biography & Other Authors responsive layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 mb-16 items-start">
            
            {/* Biography Content (Left column on Desktop) */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex flex-col sm:flex-row gap-8 items-start">
                {/* Image */}
                {author.image && (
                  <div className="w-full sm:w-2/5 shrink-0 relative rounded-2xl overflow-hidden shadow-2xl border border-border">
                    <Image
                      src={author.image}
                      alt={author.name}
                      width={600}
                      height={600}
                      className="w-full h-auto object-cover hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                )}

                {/* Introduction */}
                <div className="space-y-6 flex-1">
                  <p className="text-lg text-text-primary font-sans leading-relaxed font-medium">
                    {author.intro1}
                    <svg className="w-4 h-4 text-amber-500 inline-block ml-1.5 align-text-bottom" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                    </svg>
                  </p>
                  <p className="text-base text-text-secondary font-sans leading-relaxed">
                    {author.intro2}
                  </p>
                </div>
              </div>
            </div>

            {/* Other Authors Card (Right column on Desktop) */}
            <div className="lg:col-span-1 h-full">
              <div className="genz-glass genz-glow p-6 rounded-[24px] border border-accent/15 shadow-[0_8px_30px_rgba(0,0,0,0.03)] hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group/card flex flex-col h-full bg-surface-raised/50 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-150">
                {/* Subtle top gradient accent glow line */}
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-accent to-[var(--accent-secondary)] opacity-80" />
                
                <h2 className="text-[13px] font-mono tracking-widest uppercase font-bold text-text-primary mb-6 flex items-center gap-2">
                  Other Authors
                  <svg className="w-4 h-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                  </svg>
                </h2>

                {/* Authors List */}
                <div className="flex-1 space-y-4">
                  {otherAuthors.map((authorItem, idx) => (
                    <div 
                      key={idx} 
                      className="flex items-center gap-4 py-3 border-b border-accent/10 last:border-0 last:pb-0 group/author transition-colors duration-200"
                    >
                      {authorItem.avatar ? (
                        <div className="relative w-10 h-10 rounded-full overflow-hidden border border-accent/20 shrink-0 transition-transform duration-300 group-hover/author:scale-110">
                          <Image
                            src={authorItem.avatar}
                            alt={authorItem.name}
                            fill
                            sizes="40px"
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-accent/10 dark:bg-accent/5 border border-accent/20 flex items-center justify-center shrink-0 text-accent transition-transform duration-300 group-hover/author:scale-110">
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                          </svg>
                        </div>
                      )}
                      
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-text-primary truncate transition-colors duration-300 group-hover/author:text-accent">
                          {authorItem.name}
                        </p>
                        <p className="text-xs text-text-tertiary font-medium">
                          {authorItem.role}
                        </p>
                      </div>

                      {!authorItem.isPlaceholder && (
                        <svg className="w-4 h-4 text-text-tertiary opacity-0 group-hover/author:opacity-100 group-hover/author:translate-x-1 transition-all duration-300 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                        </svg>
                      )}
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <div className="mt-8">
                  <Link 
                    href="/authors" 
                    className="genz-btn-gradient w-full py-3 px-6 rounded-full inline-flex items-center justify-center gap-2 group/btn cursor-pointer transition-all duration-300 shadow-sm"
                  >
                    <span className="text-[13px] font-bold tracking-wide">See More Authors</span>
                    <svg 
                      className="w-4 h-4 transform transition-transform duration-300 group-hover/btn:translate-x-1" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor" 
                      strokeWidth={2.5}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>

          </div>

          {/* Interests Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 pt-12 relative">
            <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, var(--accent), var(--accent-secondary), transparent)' }}></div>
            {author.interests.map((interest, idx) => (
              <div key={idx} className="space-y-3 genz-glass genz-glow p-6 rounded-2xl">
                <h3 className="text-sm font-sans font-bold uppercase tracking-wider text-text-primary flex items-center gap-2">
                  <svg className="w-4 h-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15a4.5 4.5 0 004.5 4.5H18a3.75 3.75 0 001.332-7.257 3 3 0 00-3.758-3.848 5.25 5.25 0 00-10.233 2.33A4.502 4.502 0 002.25 15z" />
                  </svg>
                  {interest.title}
                </h3>
                <p className="text-sm text-text-secondary font-sans leading-relaxed">
                  {interest.description}
                </p>
              </div>
            ))}
          </div>

          {/* Core Skills */}
          <div className="mb-16 pt-12 space-y-6 relative">
            <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, var(--accent), var(--accent-secondary), transparent)' }}></div>
            <h2 className="text-xl font-heading font-extrabold tracking-tight text-text-primary flex items-center gap-2">
              Technical Skill Catalog
              <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
              </svg>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {Object.entries(author.skills).map(([category, skills]) => (
                <div key={category} className="space-y-3">
                  <h3 className="text-xs font-mono tracking-widest uppercase font-bold genz-gradient-text">
                    {category}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill) => (
                      <span
                        key={skill}
                        className={`px-3 py-1 text-xs font-mono font-semibold border rounded-full transition-all duration-300 hover:scale-105 ${CATEGORY_COLORS[category] || "bg-accent/10 text-accent border-accent/20"}`}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Editorial Philosophy */}
          <div className="mb-16 pt-12 space-y-4 relative">
            <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, var(--accent-secondary), var(--accent), transparent)' }}></div>
            <h2 className="text-xl font-heading font-extrabold tracking-tight text-text-primary flex items-center gap-2">
              Publication Philosophy
              <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-16.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-16.25v14.25" />
              </svg>
            </h2>
            <div className="prose prose-editorial max-w-none">
              <p>{author.philosophy1}</p>
              <p className="mt-4">{author.philosophy2}</p>
            </div>
          </div>

          {/* Long-term Goals */}
          <div className="pt-12 space-y-6 relative">
            <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, var(--accent-tertiary), var(--accent-secondary), transparent)' }}></div>
            <h2 className="text-xl font-heading font-extrabold tracking-tight text-text-primary flex items-center gap-2">
              Long-Term Objectives
              <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </h2>
            <ul className="space-y-4 font-sans text-base text-text-secondary">
              {author.goals.map((goal: string, idx: number) => (
                <li key={idx} className="flex items-start gap-3">
                  <span className="shrink-0 mt-2 w-2 h-2 rounded-full genz-btn-gradient" />
                  <p>{goal}</p>
                </li>
              ))}
            </ul>
          </div>

          {/* Quote (if any) */}
          {author.quote && (
            <div className="mt-16 p-8 genz-glass rounded-2xl border-l-4 border-l-accent">
              <p className="text-lg font-medium text-text-primary italic leading-relaxed">
                "{author.quote}"
              </p>
            </div>
          )}
        </div>

      </div>
    </section>
  );
}
