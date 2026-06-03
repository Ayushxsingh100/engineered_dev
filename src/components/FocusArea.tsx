interface FocusAreaProps {
  title: string;
  description: string;
  icon: string;
}

export function FocusArea({ title, description, icon }: FocusAreaProps) {
  return (
    <div
      className={
        "group rounded-xl border border-border bg-surface p-6 " +
        "transition-all duration-200 hover:border-border-hover hover:shadow-sm"
      }
    >
      <div className="mb-4 text-3xl" aria-hidden="true">
        {icon}
      </div>
      <h3 className="mb-2 text-lg font-semibold text-text-primary tracking-tight">
        {title}
      </h3>
      <p className="text-sm leading-relaxed text-text-secondary">
        {description}
      </p>
    </div>
  );
}
