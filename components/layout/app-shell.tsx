'use client';

import { useState } from 'react';
import Link from 'next/link';
import { LayoutDashboard, Calendar, FileStack, Menu, X, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

const NAV = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/calendar',  label: 'Calendar',  icon: Calendar },
  { href: '/events',    label: 'Events',    icon: FileStack },
];

// Compliance app shell — WHT language, dense, mobile-responsive. Distinct from the
// marketing navbar. Company name + (future) switcher slot in header.
export function AppShell({
  companyName = 'Compliance Platform',
  children,
}: {
  companyName?: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-cs-surface text-cs-ink">
      {/* Header */}
      <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-cs-border bg-white px-4 lg:px-6">
        <div className="flex items-center gap-2">
          <button className="lg:hidden text-cs-muted" onClick={() => setOpen((v) => !v)} aria-label="Menu">
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
          <ShieldCheck size={18} className="text-cs-green" />
          <span className="text-sm font-semibold">{companyName}</span>
        </div>
        {/* Company switcher slot (consultant accounts) — wired in Phase D */}
        <div className="text-xs text-cs-subtle" data-slot="company-switcher" />
      </header>

      <div className="flex">
        {/* Sidebar */}
        <nav
          className={cn(
            'fixed inset-y-14 left-0 z-20 w-56 border-r border-cs-border bg-white p-3 lg:static lg:inset-auto lg:block',
            open ? 'block' : 'hidden'
          )}
        >
          <ul className="space-y-1">
            {NAV.map(({ href, label, icon: Icon }) => (
              <li key={href}>
                <Link
                  href={href}
                  onClick={() => setOpen(false)}
                  className="flex min-h-[44px] items-center gap-2.5 rounded-md px-3 text-sm font-medium text-cs-ink-2 hover:bg-cs-green-light hover:text-cs-green-dark"
                >
                  <Icon size={16} />
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Content */}
        <main className="min-w-0 flex-1 p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}
