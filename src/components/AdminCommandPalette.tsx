"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

interface CommandItem {
  id: string;
  label: string;
  href: string;
  category: "Actions" | "Navigation" | "Manage";
  icon?: React.ReactNode;
}

const ITEMS: CommandItem[] = [
  { 
    id: "action-new-post", 
    label: "Write a new Article", 
    href: "/admin/posts/new", 
    category: "Actions",
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
  },
  { 
    id: "action-new-project", 
    label: "Create new Case Study", 
    href: "/admin/projects/new", 
    category: "Actions",
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /><polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" /></svg>
  },
  { id: "nav-dashboard", label: "Dashboard", href: "/admin", category: "Navigation" },
  { id: "nav-articles", label: "Articles & Drafts", href: "/admin/posts", category: "Navigation" },
  { id: "nav-projects", label: "Case Studies", href: "/admin/projects", category: "Navigation" },
  { id: "manage-categories", label: "Categories", href: "/admin/categories", category: "Manage" },
  { id: "manage-team", label: "Team & Authors", href: "/admin/users", category: "Manage" },
];

export function AdminCommandPalette() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Global keyboard shortcut
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const lowerQuery = query.toLowerCase();
  const filtered = query
    ? ITEMS.filter((item) => item.label.toLowerCase().includes(lowerQuery))
    : ITEMS;

  const grouped = filtered.reduce<Record<string, CommandItem[]>>((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});

  const flatResults = Object.values(grouped).flat();

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setActiveIndex(0);
      document.body.style.overflow = "hidden";
      const timer = setTimeout(() => inputRef.current?.focus(), 50);
      return () => {
        clearTimeout(timer);
        document.body.style.overflow = "";
      };
    } else {
      document.body.style.overflow = "";
    }
  }, [isOpen]);

  const navigate = useCallback((href: string) => {
    setIsOpen(false);
    router.push(href);
  }, [router]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActiveIndex((prev) => (prev < flatResults.length - 1 ? prev + 1 : 0));
        break;
      case "ArrowUp":
        e.preventDefault();
        setActiveIndex((prev) => (prev > 0 ? prev - 1 : flatResults.length - 1));
        break;
      case "Enter":
        e.preventDefault();
        if (flatResults[activeIndex]) {
          navigate(flatResults[activeIndex].href);
        }
        break;
      case "Escape":
        e.preventDefault();
        setIsOpen(false);
        break;
    }
  }, [flatResults, activeIndex, navigate]);

  useEffect(() => {
    if (!listRef.current) return;
    const activeEl = listRef.current.querySelector<HTMLElement>(`[data-index="${activeIndex}"]`);
    activeEl?.scrollIntoView({ block: "nearest" });
  }, [activeIndex]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4 font-sans select-none">
          {/* Backdrop with framer-motion */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="absolute inset-0 bg-black/20 dark:bg-black/40 backdrop-blur-md"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />

          {/* Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative z-10 w-full max-w-2xl overflow-hidden rounded-[16px] bg-[var(--studio-surface)] border border-[var(--studio-border-strong)] shadow-[var(--studio-shadow-lg)]"
            role="dialog"
            aria-modal="true"
            onKeyDown={handleKeyDown}
          >
            {/* Search input */}
            <div className="flex items-center gap-3 border-b border-[var(--studio-border)] px-4 py-3 bg-[var(--studio-surface-subtle)]">
              <svg className="h-5 w-5 shrink-0 text-[var(--studio-text-3)]" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
              </svg>
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="What do you need to do? (Search CMS...)"
                className="h-10 w-full bg-transparent text-[1.0625rem] text-[var(--studio-text-1)] placeholder-[var(--studio-text-3)] outline-none font-medium"
                autoComplete="off"
              />
              <kbd className="hidden shrink-0 rounded border border-[var(--studio-border)] bg-[var(--studio-surface)] px-2 py-1 font-mono text-[10px] text-[var(--studio-text-2)] sm:inline font-bold">
                ESC
              </kbd>
            </div>

            {/* Results */}
            <div ref={listRef} className="max-h-[60vh] overflow-y-auto p-3 bg-[var(--studio-surface)]">
              {flatResults.length === 0 ? (
                <div className="px-3 py-8 text-center text-[0.875rem] text-[var(--studio-text-3)] font-medium">
                  No actions found.
                </div>
              ) : (
                Object.entries(grouped).map(([category, items]) => (
                  <div key={category} className="mb-4 last:mb-0">
                    <div className="mb-2 px-3 pt-2 text-[0.6875rem] font-bold uppercase tracking-wider text-[var(--studio-text-3)]">
                      {category}
                    </div>
                    {items.map((item) => {
                      const index = flatResults.findIndex(i => i.id === item.id);
                      const isActive = index === activeIndex;
                      return (
                        <div
                          key={item.id}
                          data-index={index}
                          onClick={() => navigate(item.href)}
                          onMouseEnter={() => setActiveIndex(index)}
                          className={
                            "flex w-full items-center gap-3 rounded-[10px] px-3 py-2.5 text-left text-[0.875rem] transition-colors cursor-pointer " +
                            (isActive
                              ? "bg-[var(--studio-accent)] text-white font-medium"
                              : "text-[var(--studio-text-2)] hover:bg-[var(--studio-surface-subtle)]")
                          }
                        >
                          {item.icon ? (
                            <span className={isActive ? "opacity-100" : "opacity-70"}>{item.icon}</span>
                          ) : (
                            <svg className={`h-4 w-4 shrink-0 ${isActive ? "opacity-100" : "opacity-60"}`} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                            </svg>
                          )}
                          <span className="truncate">{item.label}</span>
                          {isActive && (
                            <svg className="ml-auto h-4 w-4 shrink-0 opacity-80" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                            </svg>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between border-t border-[var(--studio-border)] px-4 py-2.5 bg-[var(--studio-surface-subtle)]">
               <div className="text-[0.6875rem] font-medium text-[var(--studio-text-3)] flex items-center gap-4">
                  <span className="flex items-center gap-1.5">
                    <kbd className="rounded border border-[var(--studio-border)] bg-[var(--studio-surface)] px-1.5 py-0.5 font-mono text-[9px]">↑↓</kbd> navigate
                  </span>
                  <span className="flex items-center gap-1.5">
                    <kbd className="rounded border border-[var(--studio-border)] bg-[var(--studio-surface)] px-1.5 py-0.5 font-mono text-[9px]">↵</kbd> select
                  </span>
               </div>
               <div className="text-[0.6875rem] font-bold text-[var(--studio-text-3)] uppercase tracking-wider">
                 CMS Studio
               </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
