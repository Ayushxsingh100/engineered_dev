interface TagBadgeProps {
  tag: string;
  link?: boolean;
}

import Link from "next/link";

export function TagBadge({ tag, link = false }: TagBadgeProps) {
  const baseClasses =
    "inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-medium " +
    "bg-surface-alt text-text-secondary border border-border " +
    "transition-colors duration-150";

  const hoverClasses = "hover:bg-accent-100 hover:text-accent-700 hover:border-accent-200 " +
    "dark:hover:bg-accent-900 dark:hover:text-accent-300 dark:hover:border-accent-800";

  if (link) {
    return (
      <Link
        href={`/blog/tag/${encodeURIComponent(tag.toLowerCase())}`}
        className={`${baseClasses} ${hoverClasses}`}
      >
        {tag}
      </Link>
    );
  }

  return <span className={baseClasses}>{tag}</span>;
}
