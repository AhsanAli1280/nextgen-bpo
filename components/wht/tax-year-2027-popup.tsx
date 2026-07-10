'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { sendGAEvent } from '@next/third-parties/google';
import { ArrowRight, Calculator, ShieldCheck, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Static, non-personal analytics parameters. No user data, storage values, or
// tax amounts are ever sent. Analytics is best-effort: any failure is swallowed
// so it can never block the popup showing, closing, or CTA navigation.
const ANALYTICS_PARAMS = {
  source_page: 'tax_year_2027',
  popup_name: 'wht_calculator_promotion',
} as const;

function track(event: string, params: Record<string, string>) {
  try {
    sendGAEvent('event', event, params);
  } catch {
    /* analytics must never break the popup or navigation */
  }
}

/* ============================================================================
   Conversion popup shown on /tax-year-2027-pakistan only. Encourages visitors
   to use the Pakistan Withholding Tax Calculator. Appears ~6s after load, once
   per browser session (sessionStorage, no cookies). Fully accessible dialog
   modelled on the pricing InquiryModal (focus trap, Escape, backdrop dismiss,
   scroll lock, focus restore). Purely additive — does not alter server-rendered
   page content, headings, metadata or schema.
   ============================================================================ */

const SESSION_KEY = 'ty2027-wht-popup-shown';
const SHOW_DELAY_MS = 6000;

export function TaxYear2027Popup() {
  const [open, setOpen] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const prefersReducedMotion = useReducedMotion();

  // Arm a single ~6s timer. Skip entirely if already shown this session.
  useEffect(() => {
    let shown = false;
    try {
      shown = sessionStorage.getItem(SESSION_KEY) === '1';
    } catch {
      // sessionStorage unavailable (private mode / blocked) — treat as shown so
      // we fail closed and never nag.
      shown = true;
    }
    if (shown) return;

    const timer = window.setTimeout(() => {
      try {
        sessionStorage.setItem(SESSION_KEY, '1');
      } catch {
        /* ignore write failures */
      }
      setOpen(true);
      // Fire only when popup is actually displayed — not on mount or timer arm.
      // Guarded by the session flag above, so at most once per session.
      track('wht_calculator_popup_view', { ...ANALYTICS_PARAMS });
    }, SHOW_DELAY_MS);

    return () => window.clearTimeout(timer);
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
    previousFocusRef.current?.focus();
  }, []);

  // Move focus in, lock scroll, trap focus and handle Escape while open.
  useEffect(() => {
    if (!open) return;
    previousFocusRef.current = document.activeElement as HTMLElement | null;
    document.body.style.overflow = 'hidden';

    const dialog = dialogRef.current;
    const focusables = () =>
      dialog
        ? Array.from(
            dialog.querySelectorAll<HTMLElement>(
              'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            )
          ).filter((el) => !el.hasAttribute('disabled'))
        : [];
    focusables()[0]?.focus();

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        e.preventDefault();
        handleClose();
        return;
      }
      if (e.key === 'Tab') {
        const items = focusables();
        if (items.length === 0) return;
        const first = items[0];
        const last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [open, handleClose]);

  return (
    <AnimatePresence>
      {open && (
        <div
          className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-6"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) handleClose();
          }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-brand-dark/60 backdrop-blur-sm"
            aria-hidden="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.2 }}
          />

          {/* Card */}
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="ty2027-popup-title"
            aria-describedby="ty2027-popup-desc"
            className="relative w-full sm:max-w-md max-h-[92vh] overflow-y-auto bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl p-6 sm:p-8"
            initial={
              prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: 8 }
            }
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={
              prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.98, y: 8 }
            }
            transition={{ duration: prefersReducedMotion ? 0 : 0.22, ease: 'easeOut' }}
          >
            <button
              type="button"
              onClick={handleClose}
              aria-label="Close calculator popup"
              className="absolute top-3 right-3 inline-flex items-center justify-center w-10 h-10 rounded-xl text-brand-gray hover:text-brand-dark hover:bg-brand-light focus:outline-none focus:ring-2 focus:ring-brand-green/50 transition-colors"
            >
              <X className="w-5 h-5" aria-hidden="true" />
            </button>

            <div className="flex w-12 h-12 rounded-xl bg-brand-green/10 items-center justify-center mb-5">
              <Calculator className="w-6 h-6 text-brand-green" aria-hidden="true" />
            </div>

            <p className="text-xs font-semibold uppercase tracking-widest text-brand-green mb-2 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" aria-hidden="true" />
              Free Online Calculator
            </p>

            <h2
              id="ty2027-popup-title"
              className="text-xl sm:text-2xl font-bold text-brand-dark leading-tight mb-3 pr-8"
            >
              Calculate Withholding Tax Instantly
            </h2>

            <p
              id="ty2027-popup-desc"
              className="text-sm text-brand-gray leading-relaxed mb-6"
            >
              We have automated Pakistan&apos;s income tax withholding rates. Simply select the
              relevant transaction, enter the amount, and instantly calculate the applicable
              withholding tax with a clear, detailed explanation.
            </p>

            <Button asChild size="lg" className="w-full">
              <Link
                href="/wht-calculator"
                data-analytics="tax-year-2027-wht-calculator-popup"
                onClick={() => {
                  track('wht_calculator_popup_click', {
                    ...ANALYTICS_PARAMS,
                    destination: '/wht-calculator',
                  });
                  handleClose();
                }}
              >
                Use the Withholding Tax Calculator
                <ArrowRight className="ml-2 -mr-1 w-4 h-4" aria-hidden="true" />
              </Link>
            </Button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
