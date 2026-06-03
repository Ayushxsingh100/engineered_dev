"use client";

import { useState, useEffect } from "react";
import { Header } from "./Header";
import { CommandPalette, useCommandPalette } from "./CommandPalette";

interface SearchPost {
  title: string;
  slug: string;
  description: string;
}

interface SearchProject {
  name: string;
  slug: string;
  description: string;
}

interface NavigationShellProps {
  posts?: SearchPost[];
  projects?: SearchProject[];
}

export function NavigationShell({ posts: initialPosts, projects: initialProjects }: NavigationShellProps) {
  const { isOpen, open, close } = useCommandPalette();
  const [posts, setPosts] = useState<SearchPost[]>(initialPosts || []);
  const [projects, setProjects] = useState<SearchProject[]>(initialProjects || []);
  const [fetched, setFetched] = useState(!!initialPosts?.length);

  // Lazy-load search data when palette opens (if not already provided via SSR props)
  useEffect(() => {
    if (isOpen && !fetched) {
      setFetched(true);
      fetch("/api/search")
        .then((res) => res.json())
        .then((data) => {
          if (data.posts) setPosts(data.posts);
          if (data.projects) setProjects(data.projects);
        })
        .catch((err) => console.error("Failed to load search data:", err));
    }
  }, [isOpen, fetched]);

  return (
    <>
      <Header onCommandPaletteOpen={open} />
      <CommandPalette posts={posts} projects={projects} isOpen={isOpen} onClose={close} />
    </>
  );
}

export default NavigationShell;
