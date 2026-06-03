"use client";

import { useEffect, useState } from "react";

// ─── Fake-live log lines that cycle to simulate activity ──────────────────────
const LOG_LINES = [
  { ts: "10:09:03", level: "INFO",  msg: "raft: leader elected  node=us-east-1a" },
  { ts: "10:09:07", level: "INFO",  msg: "grpc: stream opened   svc=task-queue" },
  { ts: "10:09:11", level: "WARN",  msg: "redis: eviction spike  mem=87%" },
  { ts: "10:09:14", level: "INFO",  msg: "k8s: pod healthy       ns=infra" },
  { ts: "10:09:18", level: "INFO",  msg: "kafka: lag stable      lag=14" },
  { ts: "10:09:22", level: "INFO",  msg: "postgres: checkpoint ok wal=4.2MB" },
  { ts: "10:09:26", level: "ERROR", msg: "ebpf: probe attached   pid=2891" },
  { ts: "10:09:30", level: "INFO",  msg: "terraform: plan 0 changes" },
  { ts: "10:09:33", level: "INFO",  msg: "prometheus: scrape ok  targets=12" },
  { ts: "10:09:37", level: "WARN",  msg: "cpu: p99 latency  ms=142" },
];

// ─── Node definitions for the architecture diagram ────────────────────────────
const NODES = [
  { id: "lb",       label: "Load Balancer",  x: 50,   y: 30,  color: "#6366f1" },
  { id: "api1",     label: "API :8080",       x: 22,   y: 55,  color: "#8b5cf6" },
  { id: "api2",     label: "API :8081",       x: 78,   y: 55,  color: "#8b5cf6" },
  { id: "queue",    label: "Task Queue",      x: 50,   y: 72,  color: "#06b6d4" },
  { id: "pg",       label: "Postgres",        x: 22,   y: 87,  color: "#10b981" },
  { id: "redis",    label: "Redis",           x: 78,   y: 87,  color: "#f59e0b" },
];

// lines: [from, to]
const EDGES: [string, string][] = [
  ["lb", "api1"],
  ["lb", "api2"],
  ["api1", "queue"],
  ["api2", "queue"],
  ["queue", "pg"],
  ["queue", "redis"],
];

function nodeById(id: string) {
  return NODES.find((n) => n.id === id)!;
}

// Metrics bars that "breathe"
const METRICS = [
  { label: "CPU",     base: 38 },
  { label: "MEM",     base: 62 },
  { label: "NET I/O", base: 24 },
  { label: "DISK",    base: 11 },
];

export default function InfraVisual() {
  const [tick, setTick] = useState(0);
  const [logIdx, setLogIdx] = useState(0);
  const [visibleLogs, setVisibleLogs] = useState<typeof LOG_LINES>([]);
  const [metricValues, setMetricValues] = useState(METRICS.map((m) => m.base));

  // Advance log feed every 2.5s
  useEffect(() => {
    const id = setInterval(() => {
      setLogIdx((i) => {
        const next = (i + 1) % LOG_LINES.length;
        setVisibleLogs((prev) => [...prev.slice(-4), LOG_LINES[next]]);
        return next;
      });
    }, 2500);
    // seed initial logs
    setVisibleLogs(LOG_LINES.slice(0, 3));
    return () => clearInterval(id);
  }, []);

  // Animate metrics every 1.8s
  useEffect(() => {
    const id = setInterval(() => {
      setTick((t) => t + 1);
      setMetricValues(METRICS.map((m) => {
        const jitter = (Math.random() - 0.5) * 18;
        return Math.max(6, Math.min(94, m.base + jitter));
      }));
    }, 1800);
    return () => clearInterval(id);
  }, []);

  const levelColor: Record<string, string> = {
    INFO:  "#6366f1",
    WARN:  "#f59e0b",
    ERROR: "#10b981", // green because ebpf probe IS success here
  };

  return (
    <div className="relative w-full h-full rounded-2xl border border-border bg-[#0a0a0a] overflow-hidden font-mono text-[11px] flex flex-col">
      {/* ── Header bar ── */}
      <div className="flex items-center gap-2 px-3 py-2.5 border-b border-[#1c1c1c] bg-[#0d0d0d]">
        <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        <span className="ml-2 text-[10px] text-[#444] tracking-wider">infra-monitor — prod-cluster</span>
        <span className="ml-auto flex items-center gap-1 text-[#28c840] text-[9px]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#28c840] animate-pulse" />
          LIVE
        </span>
      </div>

      {/* ── Architecture diagram ── */}
      <div className="px-3 pt-3 pb-1 border-b border-[#1c1c1c]">
        <p className="text-[9px] text-[#333] uppercase tracking-widest mb-2">service topology</p>
        <svg viewBox="0 0 100 100" className="w-full" style={{ height: 140 }}>
          {/* Edges */}
          {EDGES.map(([fromId, toId]) => {
            const f = nodeById(fromId);
            const t = nodeById(toId);
            return (
              <line
                key={`${fromId}-${toId}`}
                x1={f.x} y1={f.y}
                x2={t.x} y2={t.y}
                stroke="#1f1f1f"
                strokeWidth="0.5"
              />
            );
          })}

          {/* Animated data packets along edges */}
          {EDGES.map(([fromId, toId], i) => {
            const f = nodeById(fromId);
            const t = nodeById(toId);
            const delay = (i * 0.4 + tick * 0.1) % 2;
            return (
              <circle key={`pkt-${fromId}-${toId}`} r="0.8" fill={nodeById(fromId).color} opacity="0.7">
                <animateMotion
                  dur={`${1.6 + i * 0.15}s`}
                  begin={`${delay}s`}
                  repeatCount="indefinite"
                  path={`M ${f.x} ${f.y} L ${t.x} ${t.y}`}
                />
              </circle>
            );
          })}

          {/* Nodes */}
          {NODES.map((n) => (
            <g key={n.id}>
              {/* Outer glow ring */}
              <circle cx={n.x} cy={n.y} r="4.5" fill="none" stroke={n.color} strokeWidth="0.4" opacity="0.25">
                <animate attributeName="r" values="4.5;5.5;4.5" dur="3s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.25;0.5;0.25" dur="3s" repeatCount="indefinite" />
              </circle>
              {/* Node circle */}
              <circle cx={n.x} cy={n.y} r="3.2" fill="#111" stroke={n.color} strokeWidth="0.6" />
              {/* Label */}
              <text x={n.x} y={n.y + 7} textAnchor="middle" fill="#555" fontSize="2.4" fontFamily="monospace">
                {n.label}
              </text>
            </g>
          ))}
        </svg>
      </div>

      {/* ── Metrics ── */}
      <div className="px-3 py-2.5 border-b border-[#1c1c1c] space-y-1.5">
        <p className="text-[9px] text-[#333] uppercase tracking-widest mb-2">system metrics</p>
        {METRICS.map((m, i) => (
          <div key={m.label} className="flex items-center gap-2">
            <span className="w-10 text-[9px] text-[#444]">{m.label}</span>
            <div className="flex-1 h-1 bg-[#1a1a1a] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-[1800ms] ease-in-out"
                style={{
                  width: `${metricValues[i]}%`,
                  background: metricValues[i] > 75
                    ? "linear-gradient(90deg,#f59e0b,#ef4444)"
                    : "linear-gradient(90deg,#6366f1,#8b5cf6)",
                }}
              />
            </div>
            <span className="w-7 text-right text-[9px] text-[#555]">{Math.round(metricValues[i])}%</span>
          </div>
        ))}
      </div>

      {/* ── Log feed ── */}
      <div className="flex-1 px-3 py-2 overflow-hidden">
        <p className="text-[9px] text-[#333] uppercase tracking-widest mb-2">event stream</p>
        <div className="space-y-1">
          {visibleLogs.map((line, i) => (
            <div
              key={i}
              className="flex gap-2 items-start"
              style={{ opacity: i === visibleLogs.length - 1 ? 1 : 0.4 + i * 0.15 }}
            >
              <span className="text-[#2a2a2a] shrink-0">{line.ts}</span>
              <span className="shrink-0" style={{ color: levelColor[line.level] ?? "#6366f1" }}>
                {line.level.padEnd(5)}
              </span>
              <span className="text-[#404040] truncate">{line.msg}</span>
            </div>
          ))}
          {/* blinking cursor */}
          <div className="flex gap-2 items-center">
            <span className="text-[#2a2a2a]">{">"}</span>
            <span className="inline-block w-1.5 h-3 bg-[#6366f1] animate-[pulse_1s_ease-in-out_infinite]" />
          </div>
        </div>
      </div>
    </div>
  );
}
