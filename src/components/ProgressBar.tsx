"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export function ProgressBar() {
  const [progress, setProgress] = useState(0);
  const pathname = usePathname();

  // Only show progress bar on blog post pages
  const isBlogPost = pathname?.startsWith("/blog/") && pathname.length > 6;

  useEffect(() => {
    if (!isBlogPost) return;

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight;
      const winHeight = window.innerHeight;
      
      const maxScroll = docHeight - winHeight;
      const currentProgress = maxScroll > 0 ? (scrollY / maxScroll) * 100 : 0;
      
      setProgress(currentProgress);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    // Trigger once on mount to handle initial state
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [isBlogPost, pathname]); // Re-bind on path change

  if (!isBlogPost) return null;

  return (
    <div className="fixed top-0 left-0 w-full h-[2px] z-[99999] pointer-events-none bg-transparent">
      <div 
        className="h-full bg-accent transition-all duration-150 ease-out shadow-[0_0_8px_var(--color-accent)]"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
