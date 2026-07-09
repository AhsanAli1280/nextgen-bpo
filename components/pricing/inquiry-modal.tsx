'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { AlertCircle, CheckCircle, Send, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PRICING_CATALOG } from '@/lib/data/pricing-catalog';
import { CONTACT } from '@/lib/constants';

// Same public Web3Forms access key used by the homepage contact form
// (Web3Forms keys are designed to be public).
const WEB3FORMS_ACCESS_KEY = '53822685-7996-4114-852a-720cd99fc38d';

interface InquiryModalProps {
  open: boolean;
  serviceTitle: string;
  /** Show the optional company/firm field (B2B custom-quote services). */
  showCompanyField: boolean;
  onClose: () => void;
}

type FormStatus = 'idle' | 'submitting' | 'success' | 'error';

const inputClass =
  'mt-2 w-full rounded-xl border border-brand-border px-4 py-3 text-sm outline-none focus:border-brand-green focus:ring-2 focus:ring-brand-green/20 placeholder:text-brand-gray/50';

export function InquiryModal({ open, serviceTitle, showCompanyField, onClose }: InquiryModalProps) {
  const [status, setStatus] = useState<FormStatus>('idle');
  const dialogRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const handleClose = useCallback(() => {
    onClose();
    // Return focus to the button that opened the modal.
    previousFocusRef.current?.focus();
  }, [onClose]);

  // Capture the trigger element, move focus in, lock scroll, handle Escape +
  // a simple focus trap while the modal is open.
  useEffect(() => {
    if (!open) return;
    previousFocusRef.current = document.activeElement as HTMLElement | null;
    setStatus('idle');
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

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === 'submitting') return; // guard against duplicate submissions
    setStatus('submitting');
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(data),
      });
      const json = (await res.json()) as { success?: boolean };
      if (json.success) {
        setStatus('success');
        form.reset();
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div className="absolute inset-0 bg-brand-dark/60" aria-hidden="true" />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="pricing-inquiry-title"
        className="relative w-full sm:max-w-lg max-h-[92vh] overflow-y-auto bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl p-6 sm:p-8 motion-safe:animate-in"
      >
        <button
          type="button"
          onClick={handleClose}
          aria-label="Close inquiry form"
          className="absolute top-4 right-4 inline-flex items-center justify-center w-11 h-11 rounded-xl text-brand-gray hover:text-brand-dark hover:bg-brand-light focus:outline-none focus:ring-2 focus:ring-brand-green/50 transition-colors"
        >
          <X className="w-5 h-5" aria-hidden="true" />
        </button>

        {status === 'success' ? (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <div className="w-16 h-16 rounded-full bg-brand-green/10 flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-brand-green" aria-hidden="true" />
            </div>
            <h2 id="pricing-inquiry-title" className="text-xl font-bold text-brand-dark mb-2">
              Inquiry received
            </h2>
            <p className="text-brand-gray text-sm leading-relaxed max-w-xs">
              Thank you. Our team will review your inquiry and respond within one business day to
              confirm scope, requirements, and next steps.
            </p>
            <Button type="button" variant="secondary" className="mt-6" onClick={handleClose}>
              Close
            </Button>
          </div>
        ) : (
          <>
            <h2 id="pricing-inquiry-title" className="text-xl font-bold text-brand-dark mb-1 pr-10">
              Service Inquiry
            </h2>
            <p className="text-sm text-brand-gray mb-6">
              Send your details and we will confirm the scope, requirements, and fee before any work
              begins.
            </p>
            <form onSubmit={handleSubmit} noValidate aria-label="Pricing inquiry form">
              <input type="hidden" name="access_key" value={WEB3FORMS_ACCESS_KEY} />
              <input
                type="hidden"
                name="subject"
                value={`Pricing Inquiry — ${serviceTitle} — NextGen BPO Website`}
              />
              <input type="hidden" name="from_name" value="NextGen BPO Pricing Page" />
              <input type="checkbox" name="botcheck" className="hidden" aria-hidden="true" tabIndex={-1} />

              <div className="grid gap-4">
                <label className="block">
                  <span className="text-sm font-semibold text-brand-dark">
                    Full name <span className="text-red-500" aria-hidden="true">*</span>
                  </span>
                  <input name="name" type="text" required autoComplete="name" placeholder="Your full name" className={inputClass} />
                </label>
                <label className="block">
                  <span className="text-sm font-semibold text-brand-dark">
                    Phone / WhatsApp number <span className="text-red-500" aria-hidden="true">*</span>
                  </span>
                  <input name="phone" type="tel" required autoComplete="tel" placeholder="+92 3xx xxxxxxx" className={inputClass} />
                </label>
                <label className="block">
                  <span className="text-sm font-semibold text-brand-dark">
                    Email address <span className="text-red-500" aria-hidden="true">*</span>
                  </span>
                  <input name="email" type="email" required autoComplete="email" placeholder="you@example.com" className={inputClass} />
                </label>
                {showCompanyField && (
                  <label className="block">
                    <span className="text-sm font-semibold text-brand-dark">Company or firm</span>
                    <input name="company" type="text" autoComplete="organization" placeholder="Your company or firm name" className={inputClass} />
                  </label>
                )}
                <label className="block">
                  <span className="text-sm font-semibold text-brand-dark">
                    Service <span className="text-red-500" aria-hidden="true">*</span>
                  </span>
                  <select
                    name="service"
                    required
                    defaultValue={serviceTitle}
                    className="mt-2 w-full rounded-xl border border-brand-border px-4 py-3 text-sm outline-none focus:border-brand-green focus:ring-2 focus:ring-brand-green/20 bg-white text-brand-dark"
                  >
                    {PRICING_CATALOG.map((s) => (
                      <option key={s.id} value={s.title}>
                        {s.title}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block">
                  <span className="text-sm font-semibold text-brand-dark">Message (optional)</span>
                  <textarea
                    name="message"
                    rows={3}
                    placeholder="Anything we should know — timelines, volumes, or questions."
                    className={`${inputClass} resize-y`}
                  />
                </label>
              </div>

              {status === 'error' && (
                <div role="alert" className="mt-4 flex items-center gap-2 text-sm text-red-600 bg-red-50 rounded-xl px-4 py-3">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
                  Something went wrong. Please try again or email us at {CONTACT.email}.
                </div>
              )}

              <div className="mt-6">
                <Button type="submit" disabled={status === 'submitting'} className="w-full disabled:opacity-60 disabled:cursor-not-allowed">
                  {status === 'submitting' ? 'Sending…' : 'Send Inquiry'}
                  {status !== 'submitting' && <Send className="ml-2 -mr-1 w-4 h-4" aria-hidden="true" />}
                </Button>
                <p className="text-xs text-brand-gray mt-3 leading-relaxed">
                  We use your details only to respond to your inquiry.
                </p>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
