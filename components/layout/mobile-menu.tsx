'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { NAV_ITEMS } from '@/lib/data/navigation';
import { CONTACT } from '@/lib/constants';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    if (isOpen) document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  const handleClose = () => onClose();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div className="fixed inset-0 bg-black/50 z-40 lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={handleClose} aria-hidden="true" />
          <motion.div
            className="fixed inset-y-0 right-0 w-full max-w-sm bg-white shadow-2xl z-50 lg:hidden flex flex-col"
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation menu"
          >
            <div className="flex justify-between items-center p-6 border-b border-brand-border/60">
              <span className="text-lg font-bold text-brand-dark">Menu</span>
              <button onClick={handleClose} className="p-2 rounded-lg text-brand-gray hover:text-brand-dark hover:bg-brand-light transition-colors" aria-label="Close menu">
                <X className="w-6 h-6" aria-hidden="true" />
              </button>
            </div>
            <nav className="flex-1 p-6 space-y-2">
              {NAV_ITEMS.map((item) => (
                <Link key={item.href} href={item.href} onClick={handleClose} className="block px-4 py-3 text-base font-medium text-brand-gray hover:text-brand-dark hover:bg-brand-light rounded-xl transition-colors">
                  {item.label}
                </Link>
              ))}
              <Link href="#contact" onClick={handleClose} className="block px-4 py-3 text-base font-medium text-brand-gray hover:text-brand-dark hover:bg-brand-light rounded-xl transition-colors">Contact</Link>
            </nav>
            <div className="p-6 border-t border-brand-border/60 space-y-4">
              <a href={`tel:${CONTACT.phone.replace(/[^+\d]/g, '')}`} onClick={handleClose} className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-brand-blue bg-brand-light rounded-xl hover:bg-brand-border/30 transition-colors">
                <Phone className="w-4 h-4 mr-2" aria-hidden="true" />
                {CONTACT.phone}
              </a>
              <Button asChild className="w-full">
                <Link href="#contact" onClick={handleClose}>Get Proposal</Link>
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}