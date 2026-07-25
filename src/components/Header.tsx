"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import Link from "next/link";
import { Logo } from "@/components/Logo";

const NAV = [
  { 
    href: "/blog", 
    label: "Writing", 
    icon: (className: string) => (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
      </svg>
    )
  },
  { 
    href: "/projects", 
    label: "Projects", 
    icon: (className: string) => (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 20.25h12m-7.5-3v3m3-3v3m-10.125-3h17.25c.621 0 1.125-.504 1.125-1.125V4.875c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125z" />
      </svg>
    )
  },
  /* { 
    href: "/about", 
    label: "About", 
    icon: (className: string) => (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
      </svg>
    )
  }, */
] as const;

interface HeaderProps {
  onCommandPaletteOpen?: () => void;
}

export function Header({ onCommandPaletteOpen }: HeaderProps) {
  const pathname  = usePathname();
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 15);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname?.startsWith(href);
  }

  if (
    pathname?.startsWith("/studio") ||
    pathname?.startsWith("/admin") ||
    pathname?.startsWith("/login")
  ) return null;

  return (
    <header className="fixed top-4 inset-x-0 z-50 max-w-[720px] mx-auto px-4 select-none">
      
      <div className={`w-full transition-all duration-500 ease-out relative border ${
        scrolled 
          ? "genz-glass border-accent/20 shadow-[0_8px_32px_rgba(139,92,246,0.15)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.45)] py-2.5 px-6" 
          : "genz-glass border-accent/10 shadow-[0_4px_24px_rgba(0,0,0,0.06)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.25)] py-3 px-6"
      } rounded-full flex items-center justify-between`}>
        {/* Gradient accent glow ring on scroll */}
        <div className={`absolute inset-0 rounded-full transition-opacity duration-700 pointer-events-none ${
          scrolled ? 'opacity-100' : 'opacity-0'
        }`} style={{
          background: 'linear-gradient(135deg, rgba(139,92,246,0.15), rgba(236,72,153,0.1), rgba(249,115,22,0.08))',
          filter: 'blur(1px)',
          zIndex: -1,
          margin: '-1px',
          borderRadius: 'inherit',
        }}></div>
        
        {/* Logo */}
        <Link href="/">
          <Logo />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 font-sans">
          {NAV.map(({ href, label }) => {
            const active = isActive(href);
            return (
              <Link
                key={label}
                href={href}
                className={`text-[13px] font-semibold tracking-tight transition-all duration-300 py-1.5 px-4 rounded-full relative ${
                  active
                    ? "text-white genz-btn-gradient shadow-[0_2px_12px_rgba(139,92,246,0.3)]"
                    : "text-text-secondary hover:text-text-primary hover:bg-accent/10"
                }`}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {onCommandPaletteOpen && (
            <button
              onClick={onCommandPaletteOpen}
              className="hidden sm:flex items-center gap-1.5 text-[13px] font-medium text-text-secondary hover:text-accent transition-colors duration-300 cursor-pointer"
              aria-label="Search"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Search
            </button>
          )}
          
          <button
            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
            className="hover:scale-110 active:scale-90 transition-all duration-300 cursor-pointer flex items-center justify-center"
            aria-label="Toggle theme"
          >
            {mounted ? (
              resolvedTheme === "dark" ? (
                <svg className="w-4 h-4 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 2.293a1 1 0 011.414 0l.707.707a1 1 0 01-1.414 1.414l-.707-.707a1 1 0 010-1.414zm4.707 4.707a1 1 0 010 1.414l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 14.05a1 1 0 011.414 0l.707.707a1 1 0 01-1.414 1.414l-.707-.707a1 1 0 010-1.414zM2 10a1 1 0 011-1h1a1 1 0 110 2H3a1 1 0 01-1-1zm2.293-5.707a1 1 0 010 1.414l-.707.707A1 1 0 012.17 4.93l.707-.707a1 1 0 011.414 0zM10 5a5 5 0 100 10 5 5 0 000-10z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-4 h-4 text-violet-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              )
            ) : (
              <svg className="w-4 h-4 text-accent animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            )}
          </button>
          
          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden flex items-center justify-center text-text-primary text-[13px] font-bold cursor-pointer hover:text-accent transition-colors"
          >
             {menuOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>
      
      {/* Mobile Menu Dropdown — Glassmorphism */}
      {menuOpen && (
        <div className="absolute top-14 left-4 right-4 genz-glass px-6 py-4 flex flex-col gap-2 md:hidden rounded-2xl shadow-[0_12px_40px_rgba(139,92,246,0.15)] mt-2 animate-in fade-in slide-in-from-top-2 duration-300">
          {NAV.map(({ href, label, icon }) => {
            const active = isActive(href);
            return (
              <Link
                key={label}
                href={href}
                onClick={() => setMenuOpen(false)}
                className={`text-[14px] font-medium py-2.5 border-b border-accent/10 last:border-0 transition-colors duration-300 flex items-center gap-2 ${
                  active ? "text-accent font-bold" : "text-text-secondary hover:text-accent"
                }`}
              >
                {icon("w-4 h-4 text-accent")}
                {label}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
