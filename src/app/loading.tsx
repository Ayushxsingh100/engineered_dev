export default function Loading() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-24">
      {/* Header skeleton */}
      <div className="mb-16 space-y-4">
        <div className="h-4 w-32 bg-accent/10 rounded-full animate-pulse skeleton-shimmer" />
        <div className="h-10 w-80 bg-accent/8 rounded-2xl animate-pulse skeleton-shimmer" />
        <div className="h-5 w-96 bg-accent/5 rounded-xl animate-pulse skeleton-shimmer" />
      </div>

      {/* Content grid skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="rounded-[2rem] border border-accent/10 genz-glass p-6 space-y-4"
          >
            <div className="h-4 w-20 bg-accent/10 rounded-full animate-pulse skeleton-shimmer" />
            <div className="h-6 w-full bg-accent/8 rounded-xl animate-pulse skeleton-shimmer" />
            <div className="space-y-2">
              <div className="h-4 w-full bg-accent/5 rounded-lg animate-pulse skeleton-shimmer" />
              <div className="h-4 w-3/4 bg-accent/5 rounded-lg animate-pulse skeleton-shimmer" />
            </div>
            <div className="flex gap-2 pt-2">
              <div className="h-6 w-14 bg-accent/10 rounded-full animate-pulse skeleton-shimmer" />
              <div className="h-6 w-18 bg-accent/10 rounded-full animate-pulse skeleton-shimmer" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
