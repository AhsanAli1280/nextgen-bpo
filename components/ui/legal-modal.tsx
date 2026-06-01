'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

type ModalType = 'privacy' | 'terms' | null;

function PrivacyContent() {
  return (
    <div className="space-y-6 text-sm text-brand-gray leading-relaxed">
      <p className="text-xs font-semibold uppercase tracking-widest text-brand-blue">
        Placeholder content. Full policy to be added before this website goes live.
      </p>
      <section>
        <h3 className="text-base font-semibold text-brand-dark mb-2">Information we collect</h3>
        <p>
          When you submit an enquiry through our contact form, we collect your name, company or firm name, country, service need, and the message you provide. We do not collect information about you through any other means on this website.
        </p>
      </section>
      <section>
        <h3 className="text-base font-semibold text-brand-dark mb-2">How we use your information</h3>
        <p>
          We use the information you provide solely to respond to your consultation request. We do not use it for marketing, we do not add you to mailing lists, and we do not share it with third parties.
        </p>
      </section>
      <section>
        <h3 className="text-base font-semibold text-brand-dark mb-2">Data storage and security</h3>
        <p>
          Enquiry submissions are sent to our team by email. We do not store form submissions in a database. We take reasonable precautions to protect the information you share with us.
        </p>
      </section>
      <section>
        <h3 className="text-base font-semibold text-brand-dark mb-2">Your rights</h3>
        <p>
          You can request that we delete any information you have provided by contacting us at{' '}
          <a href="mailto:info@next-genbpo.com" className="text-brand-blue hover:underline">
            info@next-genbpo.com
          </a>
          . We will respond within a reasonable timeframe.
        </p>
      </section>
      <section>
        <h3 className="text-base font-semibold text-brand-dark mb-2">Cookies</h3>
        <p>
          This website does not currently use tracking cookies or analytics. If this changes, this policy will be updated.
        </p>
      </section>
      <section>
        <h3 className="text-base font-semibold text-brand-dark mb-2">Contact</h3>
        <p>
          Questions about this policy can be sent to{' '}
          <a href="mailto:info@next-genbpo.com" className="text-brand-blue hover:underline">
            info@next-genbpo.com
          </a>
          .
        </p>
      </section>
    </div>
  );
}

function TermsContent() {
  return (
    <div className="space-y-6 text-sm text-brand-gray leading-relaxed">
      <p className="text-xs font-semibold uppercase tracking-widest text-brand-blue">
        Placeholder content. Full terms to be added before this website goes live.
      </p>
      <section>
        <h3 className="text-base font-semibold text-brand-dark mb-2">Scope of engagement</h3>
        <p>
          Every client engagement at NextGen BPO Solutions begins with a written scope of work agreed between both parties. The scope defines the services to be performed, deliverables, turnaround expectations, and review responsibilities.
        </p>
      </section>
      <section>
        <h3 className="text-base font-semibold text-brand-dark mb-2">Confidentiality</h3>
        <p>
          All client information, financial data, and business materials shared with our team are handled under a non-disclosure agreement. Access is restricted to the team members assigned to the engagement. We do not share client data with third parties.
        </p>
      </section>
      <section>
        <h3 className="text-base font-semibold text-brand-dark mb-2">Intellectual property</h3>
        <p>
          All deliverables prepared by our team for a client engagement become the property of the client upon full payment for that engagement. Work in progress remains our property until the engagement is settled.
        </p>
      </section>
      <section>
        <h3 className="text-base font-semibold text-brand-dark mb-2">Payment terms</h3>
        <p>
          Payment terms are agreed as part of the engagement scope. Invoices are issued as described in the engagement letter. Late payments may result in a pause in delivery until the account is settled.
        </p>
      </section>
      <section>
        <h3 className="text-base font-semibold text-brand-dark mb-2">Limitation of liability</h3>
        <p>
          Our liability is limited to the fees paid for the specific engagement in which any issue arose. We are not liable for decisions made by clients based on our deliverables.
        </p>
      </section>
      <section>
        <h3 className="text-base font-semibold text-brand-dark mb-2">Governing law</h3>
        <p>
          These terms are governed by the laws of Pakistan. Disputes will be resolved through mutual discussion first. If resolution is not reached, the matter may be referred to the courts of Lahore.
        </p>
      </section>
      <section>
        <h3 className="text-base font-semibold text-brand-dark mb-2">Contact</h3>
        <p>
          Questions about these terms can be sent to{' '}
          <a href="mailto:info@next-genbpo.com" className="text-brand-blue hover:underline">
            info@next-genbpo.com
          </a>
          .
        </p>
      </section>
    </div>
  );
}

export function LegalModal() {
  const [open, setOpen] = useState<ModalType>(null);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(null);
    };
    if (open) {
      document.addEventListener('keydown', handleKey);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [open]);

  const title = open === 'privacy' ? 'Privacy Policy' : 'Terms of Engagement';

  return (
    <>
      <button
        onClick={() => setOpen('privacy')}
        className="text-white/60 hover:text-white transition-colors text-sm"
      >
        Privacy Policy
      </button>
      <button
        onClick={() => setOpen('terms')}
        className="text-white/60 hover:text-white transition-colors text-sm"
      >
        Terms of Engagement
      </button>

      {open && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm"
            onClick={() => setOpen(null)}
            aria-hidden="true"
          />

          {/* Modal */}
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="legal-modal-title"
            className="fixed inset-x-4 top-[8%] bottom-[8%] sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 sm:w-full sm:max-w-2xl z-50 bg-white rounded-2xl overflow-hidden flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-brand-border/60 flex-shrink-0">
              <h2 id="legal-modal-title" className="text-lg font-bold text-brand-dark">
                {title}
              </h2>
              <button
                onClick={() => setOpen(null)}
                className="p-2 rounded-lg text-brand-gray hover:text-brand-dark hover:bg-brand-light transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto px-6 py-6">
              {open === 'privacy' ? <PrivacyContent /> : <TermsContent />}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-brand-border/60 flex-shrink-0 bg-brand-light">
              <p className="text-xs text-brand-gray">
                Last updated: {new Date().getFullYear()}. Questions? Email{' '}
                <a href="mailto:info@next-genbpo.com" className="text-brand-blue hover:underline">
                  info@next-genbpo.com
                </a>
              </p>
            </div>
          </div>
        </>
      )}
    </>
  );
}
