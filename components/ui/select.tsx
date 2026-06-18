import { cn } from '@/lib/utils';

// Native select styled to WHT language (chevron, 6px radius, focus-green).
export function Select({ className, children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        'w-full appearance-none rounded-md border border-cs-border-dark bg-white px-3.5 py-2.5 pr-9',
        'text-[0.9375rem] text-cs-ink min-h-[44px] outline-none transition-[border-color,box-shadow] duration-150',
        'focus:border-cs-green focus:shadow-cs-focus disabled:cursor-not-allowed disabled:opacity-60',
        "bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 fill=%22none%22 stroke=%22%236B7280%22 stroke-width=%222%22 viewBox=%220 0 24 24%22><path d=%22M6 9l6 6 6-6%22/></svg>')] bg-[length:16px] bg-[right_12px_center] bg-no-repeat",
        className
      )}
      {...props}
    >
      {children}
    </select>
  );
}
