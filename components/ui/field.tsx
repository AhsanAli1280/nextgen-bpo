import { cn } from '@/lib/utils';

const fieldBase =
  'w-full rounded-md border border-cs-border-dark bg-white px-3.5 py-2.5 text-[0.9375rem] text-cs-ink ' +
  'min-h-[44px] outline-none transition-[border-color,box-shadow] duration-150 ' +
  'placeholder:text-cs-subtle focus:border-cs-green focus:shadow-cs-focus ' +
  'disabled:cursor-not-allowed disabled:opacity-60';

export function Label({ className, required, children, ...props }: React.LabelHTMLAttributes<HTMLLabelElement> & { required?: boolean }) {
  return (
    <label className={cn('mb-1.5 block text-sm font-medium text-cs-ink-2', className)} {...props}>
      {children}
      {required && <span className="ml-0.5 text-status-overdue">*</span>}
    </label>
  );
}

export const Input = function Input({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn(fieldBase, className)} {...props} />;
};

export const Textarea = function Textarea({ className, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cn(fieldBase, 'min-h-[120px] resize-y', className)} {...props} />;
};

export function Field({ label, required, htmlFor, children }: { label: string; required?: boolean; htmlFor?: string; children: React.ReactNode }) {
  return (
    <div>
      <Label htmlFor={htmlFor} required={required}>{label}</Label>
      {children}
    </div>
  );
}
