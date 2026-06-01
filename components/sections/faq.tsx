'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { SectionHeading } from '@/components/ui/section-heading';
import { FAQS } from '@/lib/data/faqs';

export function FAQ() {
  const [openId, setOpenId] = useState<string | null>(null);
  const toggle = (id: string) => setOpenId(openId === id ? null : id);

  return (
    <section className="py-20 lg:py-28 bg-brand-light">
      <Container>
        <SectionHeading
          title="Frequently Asked Questions"
          subtitle="Common questions about how we work, what we cover, and how engagements start."
        />
        <div className="max-w-4xl mx-auto space-y-4">
          {FAQS.map((faq, index) => (
            <motion.div
              key={faq.id}
              className="bg-white rounded-2xl border border-brand-border/60 overflow-hidden"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
            >
              <button
                className="w-full flex items-center justify-between px-6 py-6 text-left focus:outline-none focus:ring-2 focus:ring-brand-green/50 focus:ring-inset"
                onClick={() => toggle(faq.id)}
                aria-expanded={openId === faq.id}
                aria-controls={`faq-${faq.id}`}
              >
                <span className="text-base font-semibold text-brand-dark pr-6">{faq.question}</span>
                <motion.div
                  animate={{ rotate: openId === faq.id ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex-shrink-0"
                >
                  <ChevronDown className="w-5 h-5 text-brand-gray" aria-hidden="true" />
                </motion.div>
              </button>
              <AnimatePresence initial={false}>
                {openId === faq.id && (
                  <motion.div
                    id={`faq-${faq.id}`}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6 text-brand-gray text-sm leading-relaxed border-t border-brand-border/40 pt-4">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
        <motion.div
          className="text-center mt-10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <p className="text-brand-gray text-sm mb-3">Still have questions?</p>
          <a
            href="#contact"
            className="inline-flex items-center text-sm font-medium text-brand-blue hover:text-brand-dark transition-colors"
          >
            Get in touch and we will answer them
            <ChevronDown className="ml-1.5 w-4 h-4 -rotate-90" aria-hidden="true" />
          </a>
        </motion.div>
      </Container>
    </section>
  );
}
