import { cn } from '@/lib/utils';

// Compliance card — WHT language: 8px radius, 1px border, subtle shadow. No rounded-xl.
export function Card({ className, hover = false, ...props }: React.HTMLAttributes<HTMLDivElement> & { hover?: boolean }) {
  return (
    <div
      className={cn(
        'rounded-lg border border-cs-border bg-white shadow-cs-card',
        hover && 'transition-shadow duration-200 hover:shadow-cs-card-hover hover:border-cs-border-dark',
        className
      )}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('px-5 pt-5 pb-3', className)} {...props} />;
}

export function CardBody({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('px-5 pb-5', className)} {...props} />;
}

export function CardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cn('text-base font-semibold text-cs-ink', className)} {...props} />;
}
