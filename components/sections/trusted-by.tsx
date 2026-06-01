'use client';

import { motion } from 'framer-motion';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { fadeInUp, staggerContainer } from '@/lib/animations';
import { TRUST_PILLS, PROOF_POINTS } from '@/lib/data/proof';

export function TrustedBy() {
  return (
    <section id="trust" className="py-16 lg:py-20 bg-brand-light border-y border-brand-border/60">
      <Container>
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-xs font-semibold uppercase tracking-widest text-brand-gray mb-4">
            How we deliver
          </p>
          <div className="flex flex-wrap justify-center gap-2.5">
            {TRUST_PILLS.map((pill) => (
              <span
                key={pill}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-brand-border/60 text-sm font-medium text-brand-dark shadow-sm"
              >
                <span className="w-2 h-2 rounded-full bg-brand-green flex-shrink-0" aria-hidden="true" />
                {pill}
              </span>
            ))}
          </div>
        </motion.div>

        <motion.div
          className="grid md:grid-cols-3 gap-6"
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
        >
          {PROOF_POINTS.map((point) => (
            <motion.div
              key={point.label}
              className="bg-white rounded-2xl border border-brand-border/60 p-6 shadow-sm flex items-start gap-4 hover:shadow-md transition-all duration-300"
              variants={fadeInUp}
            >
              <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-brand-green/10 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-brand-green" aria-hidden="true" />
              </div>
              <div>
                <p className="text-sm font-semibold text-brand-dark mb-1">{point.label}</p>
                <p className="text-xs text-brand-gray leading-relaxed">{point.detail}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="text-center mt-10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <a
            href="#contact"
            className="inline-flex items-center text-sm font-medium text-brand-blue hover:text-brand-dark transition-colors"
          >
            Talk to us about what you need
            <ArrowRight className="ml-1.5 w-4 h-4" aria-hidden="true" />
          </a>
        </motion.div>
      </Container>
    </section>
  );
}
