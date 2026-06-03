"use client";

/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect, useRef, useCallback } from "react";

interface TocHeading {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  headings?: TocHeading[];
}

export function TableOfContents({ headings: propHeadings }: TableOfContentsProps) {
  const [headings, setHeadings] = useState<TocHeading[]>([]);
  const [activeId, setActiveId] = useState<string>("");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Extract headings from the article or use prop
  useEffect(() => {
    if (propHeadings && propHeadings.length > 0) {
      setHeadings(propHeadings);
      return;
    }

    const article = document.querySelector("article");
    if (!article) return;

    const elements = article.querySelectorAll<HTMLElement>("h2, h3");
    const extracted: TocHeading[] = [];

    elements.forEach((el) => {
      // Ensure element has an id
      if (!el.id) {
        el.id = el.textContent
          ?.toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "") ?? "";
      }

      if (el.id) {
        extracted.push({
          id: el.id,
          text: el.textContent ?? "",
          level: el.tagName === "H2" ? 2 : 3,
        });
      }
    });

    setHeadings(extracted);
  }, [propHeadings]);

  // IntersectionObserver for active section tracking
  useEffect(() => {
    if (headings.length === 0) return;

    // Clean up old observer
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    const visibleIds = new Set<string>();

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            visibleIds.add(entry.target.id);
          } else {
            visibleIds.delete(entry.target.id);
          }
        });

        // Pick the first visible heading in document order
        const firstVisible = headings.find((h) => visibleIds.has(h.id));
        if (firstVisible) {
          setActiveId(firstVisible.id);
        }
      },
      {
        rootMargin: "-80px 0px -60% 0px",
        threshold: 0,
      }
    );

    headings.forEach((heading) => {
      const el = document.getElementById(heading.id);
      if (el) observerRef.current?.observe(el);
    });

    return () => {
      observerRef.current?.disconnect();
    };
  }, [headings]);

  const scrollTo = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (!el) return;

    const yOffset = -96; // Account for sticky header
    const y = el.getBoundingClientRect().top + window.scrollY + yOffset;
    window.scrollTo({ top: y, behavior: "smooth" });
  }, []);

  if (headings.length === 0) return null;

  return (
    <nav aria-label="Table of contents" className="w-full">
      {/* Mobile toggle */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className={
          "flex w-full items-center justify-between rounded-lg border border-border " +
          "bg-surface-alt px-4 py-2.5 text-sm font-medium text-text-primary lg:hidden"
        }
        aria-expanded={!isCollapsed}
      >
        <span className="inline-flex items-center gap-2">
          {/* List icon */}
          <svg
            className="h-4 w-4 text-text-tertiary"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
            />
          </svg>
          On this page
        </span>
        <svg
          className={
            "h-4 w-4 text-text-tertiary transition-transform duration-200 " +
            (isCollapsed ? "" : "rotate-180")
          }
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m19.5 8.25-7.5 7.5-7.5-7.5"
          />
        </svg>
      </button>

      {/* Heading list */}
      <div
        className={
          "lg:block " +
          (isCollapsed ? "hidden" : "mt-2 rounded-lg border border-border bg-surface-alt p-3 lg:mt-0 lg:border-0 lg:bg-transparent lg:p-0")
        }
      >
        <h4 className="mb-3 hidden text-[10px] font-mono font-bold uppercase tracking-widest text-accent lg:block">
          OUTLINE INDEX
        </h4>
        <ul className="space-y-2 border-l border-border/80 pl-0 list-none my-0">
          {headings.map((heading) => (
            <li key={heading.id} className="m-0 p-0">
              <button
                onClick={() => scrollTo(heading.id)}
                className={
                  "block w-full text-left text-[14px] transition-all duration-200 pl-4 py-1.5 border-l-2 -ml-[1.5px] " +
                  (heading.level === 3 ? "text-[13px] opacity-80 pl-6 " : "") +
                  (activeId === heading.id
                    ? "text-accent font-bold border-accent"
                    : "text-text-secondary font-medium hover:text-text-primary border-transparent hover:border-border/50")
                }
              >
                {heading.text}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
