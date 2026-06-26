"use client";

import { useState } from "react";
import { motion } from "framer-motion";

import Image from "next/image";

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
  },
  "Krishika": {
    name: "Krishika",
    role: "Computer Science Student",
    image: "/images/krishika.jpg",
    intro1: "Hi, I'm Krishika — a Computer Science student with a strong interest in Cloud Computing, Software Engineering, Backend Development, and Modern Technology Systems.",
    intro2: "Through Engineered, I document my journey of exploring how software is built, deployed, and scaled in the real world. This platform serves as a space to share technical learnings, project experiences, engineering insights, and emerging technologies that shape the future of software development. As I continue learning and building, my goal is to develop a deeper understanding of modern engineering practices while creating content that makes technical concepts more approachable and practical for fellow students and aspiring engineers.",
    socials: {
      github: "https://github.com/krishika",
      twitter: "https://twitter.com/krishika",
      linkedin: "https://linkedin.com/in/krishika",
    },
    interests: [
      {
        title: "Cloud Computing",
        description: "Exploring cloud infrastructure, learning AWS & Google Cloud."
      },
      {
        title: "Backend Engineering",
        description: "Building APIs and learning backend architecture using Java and Node.js."
      },
      {
        title: "Software Architecture",
        description: "Understanding system design, scalable systems, and modern technology paradigms."
      }
    ],
    skills: {
      "Languages": ["Java", "JavaScript", "SQL"],
      "Cloud & Infrastructure": ["AWS (EC2, S3, Lambda)", "Google Cloud (Learning)"],
      "Backend Development": ["Spring Boot", "Node.js", "REST APIs"],
      "Databases": ["MySQL", "MongoDB"],
      "Developer Tools": ["Git", "GitHub", "Linux/Terminal", "Vercel"],
    },
    philosophy1: "I believe learning becomes more meaningful when knowledge is shared.",
    philosophy2: "Every article on Engineered is driven by curiosity, experimentation, and continuous improvement. The objective is not simply to explain technologies, but to understand the reasoning behind engineering decisions, architecture choices, and the systems that power modern applications. This platform reflects an ongoing commitment to learning, building, and documenting that journey openly.",
    goals: [
      "Strengthen expertise in Cloud Computing and Software Engineering.",
      "Develop practical knowledge of scalable and distributed systems.",
      "Explore modern backend technologies and architecture patterns.",
      "Continuously document technical learnings and project experiences.",
      "Contribute meaningful insights to the developer community.",
      "Build a strong foundation for a career focused on engineering innovation and impactful technology."
    ],
    quote: "Great engineers are lifelong learners. Every project, challenge, and system explored is another step toward understanding how technology creates real-world impact."
  }
};

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
  const [activeAuthorKey, setActiveAuthorKey] = useState<"Ayush Singh" | "Krishika">("Ayush Singh");
  const author = AUTHORS[activeAuthorKey];

  return (
    <section className="py-12 sm:py-20 bg-surface relative">
      <div className="max-w-4xl mx-auto px-6">

        {/* Author Selector */}
        <div className="flex justify-center mb-16 relative z-10">
          <div className="inline-flex p-1.5 bg-white/20 dark:bg-black/20 backdrop-blur-xl border border-white/30 dark:border-white/10 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] rounded-full relative items-center">
            {(["Ayush Singh", "Krishika"] as const).map((name) => {
              const isActive = activeAuthorKey === name;
              return (
                <button
                  key={name}
                  onClick={() => setActiveAuthorKey(name)}
                  className={`relative px-8 py-3 rounded-full text-xs font-bold tracking-[0.15em] uppercase transition-colors duration-300 z-10 ${isActive ? "text-white" : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  style={{ WebkitTapHighlightColor: "transparent" }}
                >
                  {isActive && (
                    <motion.div
                      layoutId="active-author-pill"
                      className="absolute inset-0 bg-accent/90 backdrop-blur-md border border-white/20 rounded-full shadow-[0_4px_15px_rgba(139,92,246,0.3)]"
                      style={{ zIndex: -1 }}
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10 drop-shadow-sm">{name}</span>
                </button>
              );
            })}
          </div>
        </div>

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

          <div className="flex flex-col md:flex-row gap-12 mb-16 items-start">
            {/* Image (if any) */}
            {author.image && (
              <div className="w-full md:w-1/3 shrink-0 relative rounded-2xl overflow-hidden shadow-2xl border border-border">
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
            <div className="space-y-6 md:w-2/3">
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
