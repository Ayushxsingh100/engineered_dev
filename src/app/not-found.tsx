import Link from "next/link";

export default function NotFound() {
  return (
    <section className="flex flex-col items-center justify-center min-h-[60vh] px-6 relative">
      {/* Decorative blobs */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-accent/10 blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-48 h-48 rounded-full bg-[var(--accent-secondary)]/8 blur-[80px] pointer-events-none"></div>
      
      <div className="text-center max-w-md relative z-10">
        <p className="text-7xl sm:text-8xl font-extrabold font-heading genz-gradient-text mb-4">
          404
        </p>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2 text-text-primary flex items-center justify-center gap-2">
          Page not found
          <svg className="w-6 h-6 text-accent animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
        </h1>
        <p className="text-text-secondary mb-8 leading-relaxed font-medium">
          Oops, this page yeeted itself into the void. 
          It might have been a broken link, or the URL was typed incorrectly.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/"
            className="genz-btn-gradient inline-flex items-center px-7 py-3.5 rounded-full font-bold text-sm"
          >
            <svg
              className="mr-2 w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M7 16l-4-4m0 0l4-4m-4 4h18"
              />
            </svg>
            Back to Home
          </Link>
          <Link
            href="/blog"
            className="inline-flex items-center px-7 py-3.5 border border-accent/30 rounded-full font-bold text-sm text-accent hover:bg-accent/10 hover:border-accent transition-all duration-300 gap-1.5"
          >
            Browse Blog
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
