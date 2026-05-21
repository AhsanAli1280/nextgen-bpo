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
        <SectionHeading title="Frequently Asked Questions" subtitle="Everything you need to know about partnering with NextGen BPO Solutions." className="mb-12" />
        <div className="max-w-4xl mx-auto space-y-4">
          {FAQS.map((faq, index) => (
            <motion.div key={faq.id} className="bg-white rounded-xl border border-brand-border/60 overflow-hidden" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }}>
              <button className="w-full flex items-center justify-between p-5 text-left focus:outline-none focus:ring-2 focus:ring-brand-green/50 focus:ring-offset-2" onClick={() => toggle(faq.id)} aria-expanded={openId === faq.id} aria-controls={`faq-content-${faq.id}`}>
                <span className="text-base font-semibold text-brand-dark pr-4">{faq.question}</span>
                <motion.div animate={{ rotate: openId === faq.id ? 180 : 0 }} transition={{ duration: 0.2 }}><ChevronDown className="w-5 h-5 text-brand-gray" aria-hidden="true" /></motion.div>
              </button>
              <AnimatePresence initial={false}>
                {openId === faq.id && (
                  <motion.div id={`faq-content-${faq.id}`} initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
                    <div className="px-5 pb-5 pt-0 text-brand-gray text-sm leading-relaxed">{faq.answer}</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
        <motion.div className="text-center mt-12" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.4 }}>
          <p className="text-brand-gray mb-4">Still have questions?</p>
          <a href="#contact" className="inline-flex items-center text-sm font-medium text-brand-blue hover:text-brand-dark transition-colors">Contact our solutions team <ChevronDown className="ml-1.5 w-4 h-4 rotate-[-90deg]" aria-hidden="true" /></a>
        </motion.div>
      </Container>
    </section>
  );
}