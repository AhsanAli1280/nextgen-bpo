'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useScroll } from 'framer-motion';
import { Phone, ChevronDown } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Button } from '@/components/ui/button';
import { MobileMenu } from '@/components/layout/mobile-menu';
import { NAV_ITEMS } from '@/lib/data/navigation';
import { CONTACT, BRAND } from '@/lib/constants';

function smoothScrollTo(id: string) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth' });
}

function handleHashClick(e: React.MouseEvent<HTMLAnchorElement>, href: string) {
  if (href.startsWith('#')) {
    e.preventDefault();
    smoothScrollTo(href.slice(1));
  }
}

function DropdownNavItem({ item }: { item: (typeof NAV_ITEMS)[number] }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div
      ref={ref}
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-brand-gray hover:text-brand-dark transition-colors relative group"
        aria-haspopup="true"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        {item.label}
        <ChevronDown
          className={`w-3.5 h-3.5 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          aria-hidden="true"
        />
        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-brand-green transition-all group-hover:w-full" />
      </button>

      {open && item.children && (
        <div className="absolute left-0 top-full pt-1 z-50 w-64">
          <div className="bg-white rounded-xl border border-brand-border/60 shadow-lg py-2 overflow-hidden">
            {item.children.map((child) => (
              <Link
                key={child.href}
                href={child.href}
                onClick={() => setOpen(false)}
                className="block px-4 py-2.5 text-sm text-brand-gray hover:text-brand-dark hover:bg-brand-light transition-colors"
              >
                {child.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { scrollY } = useScroll();

  useEffect(() => {
    const unsubscribe = scrollY.onChange((latest) => {
      setIsScrolled(latest > 20);
    });
    return () => unsubscribe();
  }, [scrollY]);

  return (
    <>
      <motion.nav
        className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-md border-b border-brand-border/60"
        animate={isScrolled ? 'scrolled' : 'initial'}
        variants={{
          initial: { height: '80px', boxShadow: 'none' },
          scrolled: { height: '64px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.08)' },
        }}
      >
        <Container className="h-full">
          <div className="flex justify-between items-center h-full">
            <Link href="/" className="flex items-center group" aria-label={`${BRAND.name} - Home`}>
              <motion.div whileHover={{ scale: 1.03 }} transition={{ duration: 0.2 }}>
                <Image
                  src="/logo.svg"
                  alt={BRAND.name}
                  width={220}
                  height={66}
                  className="h-12 w-auto object-contain"
                  priority
                  unoptimized
                />
              </motion.div>
            </Link>

            <div className="hidden lg:flex items-center space-x-1">
              {NAV_ITEMS.map((item) =>
                item.children ? (
                  <DropdownNavItem key={item.href} item={item} />
                ) : (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={(e) => handleHashClick(e, item.href)}
                    className="px-4 py-2 text-sm font-medium text-brand-gray hover:text-brand-dark transition-colors relative group"
                  >
                    {item.label}
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-brand-green transition-all group-hover:w-full" />
                  </a>
                )
              )}
            </div>

            <div className="hidden lg:flex items-center space-x-4">
              <a
                href={`tel:${CONTACT.phone.replace(/[^+\d]/g, '')}`}
                className="text-sm font-medium text-brand-blue hover:text-brand-dark transition-colors flex items-center"
              >
                <Phone className="w-4 h-4 mr-1.5" aria-hidden="true" />
                {CONTACT.phone}
              </a>
              <Button asChild>
                <a href="#contact" onClick={(e) => handleHashClick(e, '#contact')}>
                  Request Consultation
                </a>
              </Button>
            </div>

            <button
              className="lg:hidden p-3 rounded-lg text-brand-gray hover:text-brand-dark hover:bg-brand-light transition-colors"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open navigation menu"
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </Container>
      </motion.nav>
      <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
    </>
  );
}
