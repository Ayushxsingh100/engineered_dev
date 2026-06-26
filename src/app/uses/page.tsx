import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Uses",
  description: "A detailed log of the hardware, software, languages, and tools I use to build distributed systems.",
};

const STACK_CATEGORIES = [
  {
    title: "Workstation & Hardware",
    items: [
      { name: "Acer Swift Go", description: "OLED display,Intel Core Ultra 5 125H, 16GB RAM. Main compilation environment." },
    ],
  },
  {
    title: "Development & Shell",
    items: [
      { name: "VS Code", description: "VS Code for typescript/web projects" },
      { name: "Github Dark Theme", description: "Stark, high-contrast dark themes to minimize optical fatigue during long sessions." },
      { name: "JetBrains Mono Font", description: "Ligature-supported mono typeface optimized for clean structural reading." },
    ],
  },
  {
    title: "Systems & Infrastructure Stack",
    items: [
      { name: "Next JS", description: "Front-end web development." },
      { name: "Firebase Backend", description: "Publication store backing this journal." },
    ],
  }

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
