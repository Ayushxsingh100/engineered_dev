"use client";

import { useEffect, useState } from "react";

export default function Template({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div
      className={
        mounted
          ? "animate-in fade-in slide-in-from-bottom-2 duration-700 ease-out fill-mode-both"
          : "opacity-0"
      }
    >
      {children}
    </div>
  );
}
