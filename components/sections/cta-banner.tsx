'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, Send, CheckCircle, AlertCircle } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Button } from '@/components/ui/button';
import { CONTACT } from '@/lib/constants';
import { fadeInUp } from '@/lib/animations';

const SERVICE_OPTIONS = [
  'Accounting Outsourcing',
  'Bookkeeping Services',
  'Payroll Processing',
  'Financial Reporting',
  'CPA Firm Support',
  'Audit Firm Support',
  'US Tax Preparation Support',
  'Pakistan Taxation Services',
  'Offshore Accounting Staffing',
  'Corporate Advisory',
];

type FormStatus = 'idle' | 'submitting' | 'success' | 'error';

export function CTABanner() {
  const [status, setStatus] = useState<FormStatus>('idle');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('submitting');
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (json.success) { setStatus('success'); form.reset(); } else { setStatus('error'); }
    } catch {
      setStatus('error');
    }
  }

  const inputClass = "mt-2 w-full rounded-xl border border-brand-border px-4 py-3 text-sm outline-none focus:border-brand-green focus:ring-2 focus:ring-brand-green/20 placeholder:text-brand-gray/50";

  return (
    <section id="contact" className="py-20 lg:py-24 bg-brand-dark relative overflow-hidden">
      <Container>
        <div className="grid lg:grid-cols-[0.85fr_1.15fr] gap-10 lg:gap-14 items-start">

          <motion.div className="text-white" variants={fadeInUp} initial="initial" whileInView="animate" viewport={{ once: true }}>
            <p className="text-xs font-semibold uppercase tracking-widest text-white/50 mb-4">Get in touch</p>
            <h2 className="text-3xl sm:text-4xl font-bold mb-5 leading-tight">
              Talk to us about what you want to hand off.
            </h2>
            <p className="text-lg text-white/75 mb-8 leading-relaxed">
              Tell us your firm type, service area, and what you need covered. We will come back with a straightforward scope and next step, with no pressure to proceed.
            </p>
            <div className="space-y-3.5 text-sm">
              <a href={`mailto:${CONTACT.email}`} className="flex items-center text-white/75 hover:text-white transition-colors">
                <Mail className="w-4 h-4 mr-3 text-brand-green flex-shrink-0" aria-hidden="true" />
                {CONTACT.email}
              </a>
              <a href={`tel:${CONTACT.phone.replace(/[^+\d]/g, '')}`} className="flex items-center text-white/75 hover:text-white transition-colors">
                <Phone className="w-4 h-4 mr-3 text-brand-green flex-shrink-0" aria-hidden="true" />
                {CONTACT.phone}
              </a>
            </div>
          </motion.div>

          <motion.div className="bg-white rounded-2xl p-6 sm:p-8 shadow-2xl" variants={fadeInUp} initial="initial" whileInView="animate" viewport={{ once: true }}>
            {status === 'success' ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-16 h-16 rounded-full bg-brand-green/10 flex items-center justify-center mb-4">
                  <CheckCircle className="w-8 h-8 text-brand-green" aria-hidden="true" />
                </div>
                <h3 className="text-xl font-bold text-brand-dark mb-2">Message received</h3>
                <p className="text-brand-gray text-sm leading-relaxed max-w-xs">
                  Thank you for getting in touch. We will review your enquiry and respond within one business day.
                </p>
                <button
                  type="button"
                  onClick={() => setStatus('idle')}
                  className="mt-6 inline-flex items-center justify-center min-h-[44px] px-4 text-sm font-medium text-brand-blue hover:text-brand-dark transition-colors rounded-lg"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate aria-label="Contact form">
                <input type="hidden" name="access_key" value="53822685-7996-4114-852a-720cd99fc38d" />
                <input type="hidden" name="subject" value="New Enquiry - NextGen BPO Solutions Website" />
                <input type="hidden" name="from_name" value="NextGen BPO Website" />
                <input type="checkbox" name="botcheck" className="hidden" aria-hidden="true" tabIndex={-1} />

                <div className="grid sm:grid-cols-2 gap-5">
                  <label className="block">
                    <span className="text-sm font-semibold text-brand-dark">Your name <span className="text-red-500" aria-hidden="true">*</span></span>
                    <input id="contact-name" name="name" type="text" required autoComplete="name" placeholder="Jane Smith" className={inputClass} />
                  </label>
                  <label className="block">
                    <span className="text-sm font-semibold text-brand-dark">Email address <span className="text-red-500" aria-hidden="true">*</span></span>
                    <input id="contact-email" name="email" type="email" required autoComplete="email" placeholder="jane@cpafirm.com" className={inputClass} />
                  </label>
                  <label className="block">
                    <span className="text-sm font-semibold text-brand-dark">Company or firm <span className="text-red-500" aria-hidden="true">*</span></span>
                    <input id="contact-company" name="company" type="text" required autoComplete="organization" placeholder="Apex CPA Group" className={inputClass} />
                  </label>
                  <label className="block">
                    <span className="text-sm font-semibold text-brand-dark">Country <span className="text-red-500" aria-hidden="true">*</span></span>
                    <input id="contact-country" name="country" type="text" required autoComplete="country-name" placeholder="United States" className={inputClass} />
                  </label>
                  <label className="block sm:col-span-2">
                    <span className="text-sm font-semibold text-brand-dark">Service needed <span className="text-red-500" aria-hidden="true">*</span></span>
                    <select id="contact-service" name="service" required className="mt-2 w-full rounded-xl border border-brand-border px-4 py-3 text-sm outline-none focus:border-brand-green focus:ring-2 focus:ring-brand-green/20 bg-white text-brand-dark">
                      <option value="">Select a service</option>
                      {SERVICE_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </label>
                </div>

                <label className="block mt-5">
                  <span className="text-sm font-semibold text-brand-dark">Tell us more <span className="text-red-500" aria-hidden="true">*</span></span>
                  <textarea id="contact-message" name="message" required rows={4} placeholder="Briefly describe what you need, your volume, and any relevant deadlines." className="mt-2 w-full rounded-xl border border-brand-border px-4 py-3 text-sm outline-none focus:border-brand-green focus:ring-2 focus:ring-brand-green/20 resize-y placeholder:text-brand-gray/50" />
                </label>

                {status === 'error' && (
                  <div id="form-error" role="alert" className="mt-4 flex items-center gap-2 text-sm text-red-600 bg-red-50 rounded-xl px-4 py-3">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
                    Something went wrong. Please try again or email us directly.
                  </div>
                )}

                <div className="mt-6 flex flex-col sm:flex-row sm:items-center gap-4">
                  <Button type="submit" disabled={status === 'submitting'} className="w-full sm:w-auto disabled:opacity-60 disabled:cursor-not-allowed">
                    {status === 'submitting' ? 'Sending...' : 'Send Message'}
                    {status !== 'submitting' && <Send className="ml-2 -mr-1 w-4 h-4" aria-hidden="true" />}
                  </Button>
                  <p className="text-xs text-brand-gray leading-relaxed">We use your details only to respond to your enquiry.</p>
                </div>
              </form>
            )}
          </motion.div>

        </div>
      </Container>
    </section>
  );
}
