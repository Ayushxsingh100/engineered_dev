"use client";

/* eslint-disable react-hooks/set-state-in-effect, react-hooks/preserve-manual-memoization */
import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";

interface CommandPalettePost {
  title: string;
  slug: string;
  description: string;
}

interface CommandPaletteProject {
  name: string;
  slug: string;
  description: string;
}

interface CommandPaletteProps {
  posts?: CommandPalettePost[];
  projects?: CommandPaletteProject[];
  isOpen: boolean;
  onClose: () => void;
}

interface CommandItem {
  id: string;
  label: string;
  href: string;
  category: "Pages" | "Blog Posts" | "Projects";
}

const PAGE_ITEMS: CommandItem[] = [
  { id: "page-home", label: "Home", href: "/", category: "Pages" },
  { id: "page-blog", label: "Blog", href: "/blog", category: "Pages" },
  { id: "page-projects", label: "Projects", href: "/projects", category: "Pages" },
  { id: "page-about", label: "About", href: "/about", category: "Pages" },
  { id: "page-uses", label: "Stack", href: "/uses", category: "Pages" },
];

export function CommandPalette({
  posts = [],
  projects = [],
  isOpen,
  onClose,
}: CommandPaletteProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Build all items
  const allItems: CommandItem[] = [
    ...PAGE_ITEMS,
    ...posts.map((post) => ({
      id: `post-${post.slug}`,
      label: post.title,
      href: `/blog/${post.slug}`,
      category: "Blog Posts" as const,
    })),
    ...projects.map((proj) => ({
      id: `proj-${proj.slug}`,
      label: proj.name,
      href: `/projects/${proj.slug}`,
      category: "Projects" as const,
    })),
  ];

  // Filter
  const lowerQuery = query.toLowerCase();
  const filtered = query
    ? allItems.filter(
        (item) =>
          item.label.toLowerCase().includes(lowerQuery) ||
          (item.category === "Blog Posts" &&
            posts
              .find((p) => p.slug === item.href.replace("/blog/", ""))
              ?.description.toLowerCase()
              .includes(lowerQuery)) ||
          (item.category === "Projects" &&
            projects
              .find((p) => p.slug === item.href.replace("/projects/", ""))
              ?.description.toLowerCase()
              .includes(lowerQuery))
      )
    : allItems;

  // Group by category
  const grouped = filtered.reduce<Record<string, CommandItem[]>>(
    (acc, item) => {
      if (!acc[item.category]) acc[item.category] = [];
      acc[item.category].push(item);
      return acc;
    },
    {}
  );

  const flatResults = Object.values(grouped).flat();

  // Reset active index on query change
  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setActiveIndex(0);
      // Small delay to ensure modal is rendered
      const timer = setTimeout(() => inputRef.current?.focus(), 50);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const navigate = useCallback(
    (href: string) => {
      onClose();
      router.push(href);
    },
    [onClose, router]
  );

  // Keyboard nav
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setActiveIndex((prev) =>
            prev < flatResults.length - 1 ? prev + 1 : 0
          );
          break;
        case "ArrowUp":
          e.preventDefault();
          setActiveIndex((prev) =>
            prev > 0 ? prev - 1 : flatResults.length - 1
          );
          break;
        case "Enter":
          e.preventDefault();
          if (flatResults[activeIndex]) {
            navigate(flatResults[activeIndex].href);
          }
          break;
        case "Escape":
          e.preventDefault();
          onClose();
          break;
      }
    },
    [flatResults, activeIndex, navigate, onClose]
  );

  // Scroll active item into view
  useEffect(() => {
    if (!listRef.current) return;
    const activeEl = listRef.current.querySelector<HTMLElement>(
      `[data-index="${activeIndex}"]`
    );
    activeEl?.scrollIntoView({ block: "nearest" });
  }, [activeIndex]);

  if (!isOpen) return null;

  let itemCounter = 0;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4 font-sans select-none">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/10 dark:bg-black/30 backdrop-blur-md animate-fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Dialog */}
      <div
        className={
          "relative z-10 w-full max-w-lg overflow-hidden rounded-squircle bg-background border border-border/40 shadow-2xl animate-fade-in-up"
        }
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        onKeyDown={handleKeyDown}
      >
        {/* Search input */}
        <div className="flex items-center gap-3 border-b border-border/30 px-4.5 py-1 bg-muted/10">
          <svg
            className="h-4 w-4 shrink-0 text-muted-foreground/60"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2.5}
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
            />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search pages, dispatches, stack..."
            className={
              "h-12 w-full bg-transparent text-[16px] text-foreground " +
              "placeholder:text-muted-foreground/50 outline-none font-heading font-medium"
            }
            aria-label="Search"
            autoComplete="off"
          />
          <kbd
            className={
              "hidden shrink-0 rounded border border-border/30 bg-muted px-2 py-0.5 font-mono text-[9px] text-muted-foreground sm:inline font-bold"
            }
          >
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div
          ref={listRef}
          className="max-h-80 overflow-y-auto p-2.5 bg-background"
          role="listbox"
        >
          {flatResults.length === 0 ? (
            <div className="px-3 py-8 text-center text-[13px] text-muted-foreground font-medium">
              No dispatches or pages found.
            </div>
          ) : (
            Object.entries(grouped).map(([category, items]) => (
              <div key={category} className="mb-2 last:mb-0">
                <div className="mb-1.5 px-3.5 pt-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
                  {category}
                </div>
                {items.map((item) => {
                  const index = itemCounter++;
                  const isActive = index === activeIndex;
                  return (
                    <button
                      key={item.id}
                      data-index={index}
                      onClick={() => navigate(item.href)}
                      onMouseEnter={() => setActiveIndex(index)}
                      className={
                        "flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-left text-[13px] " +
                        "transition-all duration-300 cursor-pointer border-l-2 " +
                        (isActive
                          ? "bg-muted text-foreground font-semibold border-accent shadow-sm"
                          : "text-muted-foreground hover:bg-muted/40 border-transparent")
                      }
                      role="option"
                      aria-selected={isActive}
                    >
                      {/* Icon */}
                      {item.category === "Pages" ? (
                        <svg
                          className="h-4 w-4 shrink-0 opacity-60"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={2}
                          stroke="currentColor"
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                          />
                        </svg>
                      ) : item.category === "Projects" ? (
                        <svg
                          className="h-4 w-4 shrink-0 opacity-60"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={2}
                          stroke="currentColor"
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5"
                          />
                        </svg>
                      ) : (
                        <svg
                          className="h-4 w-4 shrink-0 opacity-60"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={2}
                          stroke="currentColor"
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
                          />
                        </svg>
                      )}
                      <span className="truncate">{item.label}</span>
                      {isActive && (
                        <svg
                          className="ml-auto h-3.5 w-3.5 shrink-0 opacity-70"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={2.5}
                          stroke="currentColor"
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m8.25 4.5 7.5 7.5-7.5 7.5"
                          />
                        </svg>
                      )}
                    </button>
                  );
                })}
              </div>
            ))
          )}
        </div>

        {/* Footer hint */}
        <div className="flex items-center gap-4 border-t border-border/30 px-5 py-3 text-[10px] text-muted-foreground bg-muted/10 font-sans font-medium">
          <span className="inline-flex items-center gap-1.5">
            <kbd className="rounded border border-border/30 bg-muted px-1.5 py-0.5 font-mono font-bold text-[9px]">
              ↑
            </kbd>
            <kbd className="rounded border border-border/30 bg-muted px-1.5 py-0.5 font-mono font-bold text-[9px]">
              ↓
            </kbd>
            navigate
          </span>
          <span className="inline-flex items-center gap-1.5">
            <kbd className="rounded border border-border/30 bg-muted px-1.5 py-0.5 font-mono font-bold text-[9px]">
              ↵
            </kbd>
            select
          </span>
          <span className="inline-flex items-center gap-1.5">
            <kbd className="rounded border border-border/30 bg-muted px-1.5 py-0.5 font-mono font-bold text-[9px]">
              esc
            </kbd>
            close
          </span>
        </div>
      </div>
    </div>
  );
}

/**
 * Hook to manage Cmd+K / Ctrl+K shortcut for opening the palette.
 */
export function useCommandPalette() {
  const [isOpen, setIsOpen] = useState(false);

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

  return {
    isOpen,
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
  };
}
