import { AppShell } from '@/components/layout/app-shell';

// Authenticated compliance app shell. Auth guard + tenant context wired in Sprint 5B
// (currently no session lookup — chrome only). Company name resolves from tenant then.
export default function ComplianceAppLayout({ children }: { children: React.ReactNode }) {
  return <AppShell>{children}</AppShell>;
}
