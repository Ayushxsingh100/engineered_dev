"use client";

import { useState, useEffect } from "react";

export function LightboxImage(props: React.ImgHTMLAttributes<HTMLImageElement>) {
  const [isOpen, setIsOpen] = useState(false);

  // Close on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) setIsOpen(false);
    };
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden"; // Prevent scrolling behind modal
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <>
      <figure className="my-10 group relative overflow-hidden rounded-2xl border border-border bg-surface-alt">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          {...props}
          alt={props.alt ?? ""}
          loading="lazy"
          className={`w-full h-auto cursor-zoom-in transition-transform duration-700 ease-out group-hover:scale-[1.02] ${props.className || ""}`}
          onClick={() => setIsOpen(true)}
        />
        {props.alt && (
          <figcaption className="p-4 text-center text-sm font-semibold text-text-tertiary border-t border-border/50">
            {props.alt}
          </figcaption>
        )}
      </figure>

      {isOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 backdrop-blur-md cursor-zoom-out p-4 sm:p-8 animate-in fade-in duration-300"
          onClick={() => setIsOpen(false)}
        >
          <div className="relative w-full h-full max-w-7xl max-h-full flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              {...props}
              alt={props.alt ?? "Fullscreen image"}
              className="object-contain w-auto h-auto max-w-full max-h-full rounded-lg shadow-2xl"
            />
          </div>
          <button 
            className="absolute top-6 right-6 p-2 rounded-full bg-surface/50 hover:bg-surface text-text-primary backdrop-blur-md border border-border transition-all"
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(false);
            }}
            aria-label="Close fullscreen"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}
    </>
  );
}
