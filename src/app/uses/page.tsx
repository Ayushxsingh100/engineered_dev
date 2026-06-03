import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Uses",
  description: "A detailed log of the hardware, software, languages, and tools I use to build distributed systems.",
};

const STACK_CATEGORIES = [
  {
    title: "Workstation & Hardware",
    items: [
      { name: "MacBook Pro M3 Max", description: "16-inch, 64GB Unified Memory, 1TB SSD. Main compilation environment." },
      { name: "LG UltraFine Display (27\")", description: "4K resolution, dual screens for tracking logs side-by-side with code editors." },
      { name: "Keychron Q1 Max Keyboard", description: "Mechanical keyboard, custom-lubed Gateron Brown tactile switches." },
      { name: "Logitech MX Master 3S Mouse", description: "Ergonomic layout with infinite vertical scrolling." },
    ],
  },
  {
    title: "Development & Shell",
    items: [
      { name: "VS Code & Neovim", description: "VS Code for typescript/web projects; Neovim (LazyVim) for quick systems programming in Go and Rust." },
      { name: "Tokyo Night / Github Dark Theme", description: "Stark, high-contrast dark themes to minimize optical fatigue during long sessions." },
      { name: "JetBrains Mono Font", description: "Ligature-supported mono typeface optimized for clean structural reading." },
      { name: "Alacritty Terminal & tmux", description: "GPU-accelerated terminal emulator paired with tmux session persistence." },
    ],
  },
  {
    title: "Systems & Infrastructure Stack",
    items: [
      { name: "Go & Rust", description: "Languages of choice for building concurrent services, proxies, and CLI binaries." },
      { name: "AWS & Terraform", description: "Infrastructure provisioned using declarative Terraform manifests across EC2, ECS, RDS, SQS, and VPCs." },
      { name: "Docker & Kubernetes", description: "Containers for microservices, deployed on local k3s clusters or AWS EKS for orchestration." },
      { name: "Kafka & Redis", description: "Apache Kafka for transactional outboxes and event streams; Redis for caching, locks, and task queues." },
      { name: "PostgreSQL & DynamoDB", description: "PostgreSQL for relational domain structures; DynamoDB for single-digit millisecond key-value retrieval." },
    ],
  },
  {
    title: "Design & Writing Tools",
    items: [
      { name: "Firebase Backend", description: "Publication store backing this journal." },
      { name: "Figma", description: "Used for layout designs, architecture flowcharts, and system modeling diagrams." },
      { name: "Excalidraw", description: "Ideal for fast architectural sketching, whiteboard sessions, and outlining networks." },
    ],
  },
];

export default function UsesPage() {
  return (
    <section className="py-12 sm:py-20 bg-surface">
      <div className="max-w-4xl mx-auto px-6">
        
        {/* Editorial Header */}
        <div className="mb-16 border-b border-border pb-8">
          <p className="text-[10px] font-mono tracking-widest uppercase font-bold text-accent mb-3">
            EQUIPMENT REGISTRY
          </p>
          <h1 className="text-3.5xl sm:text-5xl font-display font-extrabold tracking-tight text-text-primary mb-4">
            System Instruments
          </h1>
          <p className="text-base sm:text-lg text-text-secondary font-serif leading-relaxed max-w-2xl">
            A comprehensive registry of the local development environment, hardware workstation, and backend systems infrastructure backing my operations.
          </p>
        </div>

        {/* Stack list */}
        <div className="space-y-16">
          {STACK_CATEGORIES.map((category) => (
            <div
              key={category.title}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 border-t border-border pt-10"
            >
              <h2 className="text-xs font-mono tracking-widest uppercase font-bold text-accent">
                {category.title}
              </h2>
              <div className="md:col-span-2 space-y-8">
                {category.items.map((item) => (
                  <div key={item.name} className="space-y-1.5">
                    <h3 className="text-base font-serif font-bold text-text-primary">
                      {item.name}
                    </h3>
                    <p className="text-sm text-text-secondary font-serif leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
