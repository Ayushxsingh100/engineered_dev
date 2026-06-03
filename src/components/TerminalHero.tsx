"use client";

import { useEffect, useState, useRef } from "react";

// ─── Terminal lines to type out, in sequence ──────────────────────────────────
const SCRIPT = [
  { prompt: "$",  text: "ls -la ./latest-articles",         delay: 60  },
  { prompt: "",   text: "fetching index...",                delay: 200 },
  { prompt: "",   text: "",                                 delay: 300 },
  { prompt: "→",  text: "2026-05-29  Kubernetes Networking Deep Dive", delay: 14 },
  { prompt: "→",  text: "2026-05-25  Understanding eBPF Observability",delay: 14 },
  { prompt: "→",  text: "2026-05-18  Kafka Architecture Patterns",     delay: 14 },
  { prompt: "→",  text: "2026-05-10  AWS Lambda Internals",            delay: 14 },
  { prompt: "",   text: "",                                 delay: 200 },
  { prompt: "$",  text: "./search --topic=system-design",   delay: 60  },
  { prompt: "→",  text: "Found 24 articles in System Design.",         delay: 14 },
];

type LineState = {
  prompt: string;
  text: string;
  visible: boolean;
  partial: string;
  typing: boolean;
};

export default function TerminalHero() {
  const [lines, setLines] = useState<LineState[]>([]);
  const [cursorVisible, setCursorVisible] = useState(true);
  const [done, setDone] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Blink cursor
  useEffect(() => {
    const id = setInterval(() => setCursorVisible((v) => !v), 530);
    return () => clearInterval(id);
  }, []);

  // Sequential line reveal
  useEffect(() => {
    let cancelled = false;
    let lineIdx = 0;

    const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

    async function run() {
      await sleep(400);

      for (lineIdx = 0; lineIdx < SCRIPT.length; lineIdx++) {
        if (cancelled) return;
        const def = SCRIPT[lineIdx];

        // Add the line (blank initially)
        setLines((prev) => [
          ...prev,
          { prompt: def.prompt, text: def.text, visible: true, partial: "", typing: true },
        ]);

        // Type it character by character
        for (let ci = 0; ci <= def.text.length; ci++) {
          if (cancelled) return;
          const partial = def.text.slice(0, ci);
          setLines((prev) =>
            prev.map((l, i) => (i === prev.length - 1 ? { ...l, partial } : l))
          );
          if (ci < def.text.length) await sleep(def.delay);
        }

        // Mark as done typing
        setLines((prev) =>
          prev.map((l, i) => (i === prev.length - 1 ? { ...l, typing: false } : l))
        );

        // Scroll to bottom
        containerRef.current?.scrollTo({ top: 9999, behavior: "smooth" });

        await sleep(def.text === "" ? 0 : 80);
      }

      setDone(true);
    }

    run();
    return () => { cancelled = true; };
  }, []);

  const promptColor: Record<string, string> = {
    "$": "#6366f1",
    "→": "#10b981",
    "":  "transparent",
  };

  const textColor = (line: LineState) => {
    if (line.prompt === "$") return "#a5b4fc"; // indigo-300
    if (line.prompt === "→") return "#6ee7b7"; // emerald-300
    return "#9f9faa";                           // muted
  };

  return (
    <div className="terminal-window w-full flex flex-col" style={{ minHeight: 200, maxHeight: 200 }}>
      {/* Window chrome */}
      <div className="terminal-titlebar shrink-0">
        <span className="terminal-dot" style={{ background: "#ff5f57" }} />
        <span className="terminal-dot" style={{ background: "#febc2e" }} />
        <span className="terminal-dot" style={{ background: "#28c840" }} />
        <span className="ml-3 text-[10px] font-mono" style={{ color: "#3a3a48" }}>
          ayush@eng-ws  ~/workspace/blog/articles
        </span>
        <span className="ml-auto flex items-center gap-1.5 text-[9px] font-mono" style={{ color: "#28c840" }}>
          <span
            className="h-1.5 w-1.5 rounded-full"
            style={{ background: "#28c840", animation: "blink 1.8s ease-in-out infinite" }}
          />
          reader connected
        </span>
      </div>

      {/* Terminal body */}
      <div
        ref={containerRef}
        className="flex-1 p-4 overflow-y-auto space-y-0.5"
        style={{ fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)", fontSize: 12, lineHeight: "1.7" }}
      >
        {lines.map((line, i) => (
          <div key={i} className="flex items-start gap-2 whitespace-pre">
            <span
              className="shrink-0 w-3 text-right select-none"
              style={{ color: promptColor[line.prompt] ?? "transparent", opacity: line.prompt ? 1 : 0 }}
            >
              {line.prompt || " "}
            </span>
            <span style={{ color: textColor(line) }}>
              {line.partial || " "}
              {/* Blinking cursor on the actively typing line */}
              {line.typing && (
                <span
                  style={{
                    display: "inline-block",
                    width: "7px",
                    height: "13px",
                    background: "#6366f1",
                    opacity: cursorVisible ? 1 : 0,
                    verticalAlign: "middle",
                    marginLeft: "1px",
                    borderRadius: "1px",
                  }}
                />
              )}
            </span>
          </div>
        ))}

        {/* Final cursor after all lines */}
        {done && (
          <div className="flex items-center gap-2 mt-1">
            <span className="w-3 text-right text-[11px]" style={{ color: "#6366f1" }}>$</span>
            <span
              style={{
                display: "inline-block",
                width: "7px",
                height: "13px",
                background: "#6366f1",
                opacity: cursorVisible ? 1 : 0,
                borderRadius: "1px",
                verticalAlign: "middle",
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
