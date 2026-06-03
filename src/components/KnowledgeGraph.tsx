"use client";

import { useState, useMemo } from "react";

interface Node {
  id: string;
  label: string;
  tag: string;
  x: number;
  y: number;
  color: string;
  description: string;
}

interface Edge {
  from: string;
  to: string;
}

const NODES: Node[] = [
  {
    id: "sys-design",
    label: "System Design",
    tag: "system-design",
    x: 50,
    y: 50,
    color: "#8b5cf6", // Purple
    description: "Designing reliable, scalable, and maintainable software architectures.",
  },
  {
    id: "cloud",
    label: "Cloud Computing",
    tag: "cloud-computing",
    x: 18,
    y: 32,
    color: "#3b82f6", // Blue
    description: "Orchestrating serverless runtimes, container routing, and autoscaling policies.",
  },
  {
    id: "dist-sys",
    label: "Distributed Systems",
    tag: "distributed-systems",
    x: 82,
    y: 32,
    color: "#06b6d4", // Cyan
    description: "Consensus engines, fault tolerance, replication pipelines, and high availability.",
  },
  {
    id: "backend",
    label: "Backend APIs",
    tag: "backend",
    x: 18,
    y: 68,
    color: "#ec4899", // Pink
    description: "High-performance endpoint routing, load shedding, concurrency patterns, and gRPC.",
  },
  {
    id: "db",
    label: "Database Architecture",
    tag: "database",
    x: 82,
    y: 68,
    color: "#10b981", // Emerald
    description: "Indexing models, B-Trees, transaction logs, WAL execution, and query optimization.",
  },
  {
    id: "serverless",
    label: "Serverless",
    tag: "serverless",
    x: 50,
    y: 15,
    color: "#f59e0b", // Amber
    description: "Cold-start optimization, event-driven triggers, and execution scaling.",
  },
  {
    id: "microservices",
    label: "Microservices",
    tag: "microservices",
    x: 50,
    y: 85,
    color: "#ef4444", // Red
    description: "Service mesh routing, circuit breakers, rate limiting, and distributed tracing.",
  },
];

const EDGES: Edge[] = [
  { from: "sys-design", to: "cloud" },
  { from: "sys-design", to: "dist-sys" },
  { from: "sys-design", to: "backend" },
  { from: "sys-design", to: "db" },
  { from: "sys-design", to: "microservices" },
  { from: "cloud", to: "serverless" },
  { from: "cloud", to: "microservices" },
  { from: "dist-sys", to: "db" },
  { from: "dist-sys", to: "serverless" },
  { from: "backend", to: "microservices" },
  { from: "backend", to: "db" },
];

interface KnowledgeGraphProps {
  activeTag: string | null;
  onTagClick: (tag: string) => void;
}

export function KnowledgeGraph({ activeTag, onTagClick }: KnowledgeGraphProps) {
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);

  const hoveredNode = useMemo(() => {
    return NODES.find((n) => n.id === hoveredNodeId) || null;
  }, [hoveredNodeId]);

  const activeNode = useMemo(() => {
    if (!activeTag) return null;
    return NODES.find((n) => n.tag === activeTag) || null;
  }, [activeTag]);

  // Determine connected nodes for hover highlighting
  const connectedNodeIds = useMemo(() => {
    if (!hoveredNodeId) return new Set<string>();
    const connected = new Set<string>([hoveredNodeId]);
    EDGES.forEach((edge) => {
      if (edge.from === hoveredNodeId) connected.add(edge.to);
      if (edge.to === hoveredNodeId) connected.add(edge.from);
    });
    return connected;
  }, [hoveredNodeId]);

  return (
    <div className="w-full bg-surface-raised border border-border/40 rounded-squircle p-6 shadow-apple bg-glow-subtle transition-all duration-300">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Left Side: Dynamic Concept Info Card */}
        <div className="lg:col-span-4 flex flex-col justify-center min-h-[160px] lg:border-r lg:border-border/30 lg:pr-8">
          <p className="text-[10px] font-mono tracking-widest uppercase font-bold text-accent mb-2">
            CONCEPT MONITOR
          </p>
          
          {hoveredNode || activeNode ? (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 ease-out">
              <span 
                className="inline-block text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border mb-3"
                style={{ 
                  color: (hoveredNode || activeNode)!.color, 
                  borderColor: `${(hoveredNode || activeNode)!.color}30`,
                  backgroundColor: `${(hoveredNode || activeNode)!.color}08`
                }}
              >
                {(hoveredNode || activeNode)!.label}
              </span>
              <p className="text-[14px] text-text-primary font-serif leading-relaxed mb-4">
                {(hoveredNode || activeNode)!.description}
              </p>
              <button
                onClick={() => onTagClick((hoveredNode || activeNode)!.tag)}
                className="text-[12px] font-bold text-foreground border-b border-foreground/30 hover:border-accent hover:text-accent transition-all pb-0.5"
              >
                {activeTag === (hoveredNode || activeNode)!.tag 
                  ? "Clear Filter" 
                  : `Filter articles by ${(hoveredNode || activeNode)!.label} →`}
              </button>
            </div>
          ) : (
            <div className="text-muted-foreground text-sm font-serif leading-relaxed">
              Hover over or click nodes in the topology web to analyze concepts and filter the publishing logs.
            </div>
          )}
        </div>

        {/* Right Side: Interactive SVG Web */}
        <div className="lg:col-span-8 relative aspect-[4/3] w-full bg-black/5 dark:bg-black/35 rounded-2xl border border-border/20 overflow-hidden flex items-center justify-center p-2 shadow-inner">
          
          {/* Subtle Grid Pattern Overlay */}
          <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.015] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>

          <svg viewBox="0 0 100 100" className="w-full h-full select-none select-none">
            {/* SVG Defs for Filters & Glows */}
            <defs>
              {NODES.map((n) => (
                <radialGradient id={`glow-${n.id}`} key={`glow-${n.id}`}>
                  <stop offset="0%" stopColor={n.color} stopOpacity="0.45" />
                  <stop offset="100%" stopColor={n.color} stopOpacity="0" />
                </radialGradient>
              ))}
            </defs>

            {/* Render Edges (Lines) */}
            {EDGES.map((edge, idx) => {
              const fromNode = NODES.find((n) => n.id === edge.from)!;
              const toNode = NODES.find((n) => n.id === edge.to)!;
              
              // Edge is active if either connected node is hovered, or if we have an active node and this edge connects to it
              const isHovered = hoveredNodeId 
                ? (edge.from === hoveredNodeId || edge.to === hoveredNodeId)
                : false;
                
              const isActive = activeTag 
                ? (fromNode.tag === activeTag || toNode.tag === activeTag)
                : false;

              return (
                <line
                  key={`edge-${idx}`}
                  x1={fromNode.x}
                  y1={fromNode.y}
                  x2={toNode.x}
                  y2={toNode.y}
                  stroke={isHovered ? hoveredNode?.color : isActive ? activeNode?.color : "currentColor"}
                  strokeWidth={isHovered || isActive ? "0.8" : "0.35"}
                  className="transition-all duration-300"
                  style={{
                    opacity: hoveredNodeId 
                      ? (isHovered ? 0.75 : 0.08) 
                      : (activeTag ? (isActive ? 0.6 : 0.15) : 0.25)
                  }}
                />
              );
            })}

            {/* Render Nodes */}
            {NODES.map((node) => {
              const isHovered = hoveredNodeId === node.id;
              const isConnected = connectedNodeIds.has(node.id);
              const isActive = activeTag === node.tag;

              return (
                <g 
                  key={node.id}
                  className="cursor-pointer group"
                  onMouseEnter={() => setHoveredNodeId(node.id)}
                  onMouseLeave={() => setHoveredNodeId(null)}
                  onClick={() => onTagClick(node.tag)}
                >
                  {/* Glowing Pulse Aura (Behind Node) */}
                  {(isHovered || isActive) && (
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={isHovered ? "14" : "10"}
                      fill={`url(#glow-${node.id})`}
                      className="animate-[pulse_3s_ease-in-out_infinite] transition-all duration-700"
                    />
                  )}

                  {/* Outer ring */}
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={isHovered || isActive ? "3.8" : "2.6"}
                    fill="none"
                    stroke={node.color}
                    strokeWidth={isHovered || isActive ? "0.6" : "0.4"}
                    className="transition-all duration-500 ease-out"
                    style={{
                      opacity: hoveredNodeId 
                        ? (isConnected ? 1 : 0.25)
                        : (activeTag ? (isActive ? 1 : 0.4) : 0.85)
                    }}
                  />

                  {/* Inner node core */}
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r="1.5"
                    fill={isHovered || isActive ? node.color : "var(--background)"}
                    stroke={node.color}
                    strokeWidth="0.4"
                    className="transition-all duration-500 ease-out"
                    style={{
                      opacity: hoveredNodeId 
                        ? (isConnected ? 1 : 0.25)
                        : (activeTag ? (isActive ? 1 : 0.5) : 0.95)
                    }}
                  />

                  {/* Label Text */}
                  <text
                    x={node.x}
                    y={node.y + (node.y > 75 ? -5.5 : 5.8)}
                    textAnchor="middle"
                    className="font-mono font-bold select-none transition-all duration-300"
                    style={{
                      fontSize: isHovered || isActive ? "2.2px" : "1.8px",
                      fill: isHovered || isActive ? "var(--foreground)" : "var(--muted-foreground)",
                      opacity: hoveredNodeId 
                        ? (isConnected ? 1 : 0.15)
                        : (activeTag ? (isActive ? 1 : 0.4) : 0.8)
                    }}
                  >
                    {node.label}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>
    </div>
  );
}
