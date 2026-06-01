'use client';

import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { NAV_ITEMS } from '@/lib/data/navigation';
import { CONTACT } from '@/lib/constants';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

function smoothScrollTo(id: string) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth' });
}

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) setTimeout(() => closeButtonRef.current?.focus(), 50);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') { onClose(); return; }
      if (e.key !== 'Tab') return;
      const menu = menuRef.current;
      if (!menu) return;
      const sel = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';
      const focusable = Array.from(menu.querySelectorAll<HTMLElement>(sel));
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last?.focus(); }
      } else {
        if (document.activeElement === last) { e.preventDefault(); first?.focus(); }
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  function handleNavClick(e: React.MouseEvent<HTMLAnchorElement>, href: string) {
    if (href.startsWith('#')) {
      e.preventDefault();
      onClose();
      setTimeout(() => smoothScrollTo(href.slice(1)), 50);
    } else {
      onClose();
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose} aria-hidden="true"
          />
          <motion.div
            id="mobile-menu"
            ref={menuRef}
            className="fixed inset-y-0 right-0 w-full max-w-sm bg-white shadow-2xl z-50 lg:hidden flex flex-col"
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            role="dialog" aria-modal="true" aria-label="Navigation menu"
          >
            <div className="flex justify-between items-center p-5 border-b border-brand-border/60">
              <span className="text-lg font-bold text-brand-dark">Menu</span>
              <button
                ref={closeButtonRef}
                onClick={onClose}
                className="p-3 rounded-lg text-brand-gray hover:text-brand-dark hover:bg-brand-light transition-colors"
                aria-label="Close navigation menu"
              >
                <X className="w-6 h-6" aria-hidden="true" />
              </button>
            </div>

            <nav aria-label="Main navigation" className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
              {NAV_ITEMS.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className="flex items-center min-h-[48px] px-4 py-3 text-base font-medium text-brand-gray hover:text-brand-dark hover:bg-brand-light rounded-xl transition-colors"
                >
                  {item.label}
                </a>
              ))}
              <a
                href="#contact"
                onClick={(e) => handleNavClick(e, '#contact')}
                className="flex items-center min-h-[48px] px-4 py-3 text-base font-medium text-brand-gray hover:text-brand-dark hover:bg-brand-light rounded-xl transition-colors"
              >
                Contact
              </a>
            </nav>

            <div className="px-4 pb-6 pt-4 border-t border-brand-border/60 space-y-3">
              <a
                href={`tel:${CONTACT.phone.replace(/[^+\d]/g, '')}`}
                onClick={onClose}
                className="flex items-center justify-center w-full min-h-[48px] px-4 py-3 text-sm font-medium text-brand-blue bg-brand-light rounded-xl transition-colors"
              >
                <Phone className="w-4 h-4 mr-2 flex-shrink-0" aria-hidden="true" />
                {CONTACT.phone}
              </a>
              <Button asChild className="w-full">
                <a href="#contact" onClick={(e) => handleNavClick(e, '#contact')}>
                  Request Consultation
                </a>
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
