'use client';

import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle, FileCheck2, ShieldCheck, Users } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Button } from '@/components/ui/button';
import { fadeInUp, staggerContainer } from '@/lib/animations';

const COVERAGE = [
  'Accounting and bookkeeping',
  'US and Pakistan tax support',
  'CPA and audit firm capacity',
  'Payroll and financial reporting',
];

export function Hero() {
  return (
    <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden bg-gradient-to-br from-white via-brand-light to-white">
      <Container>
        <div className="grid lg:grid-cols-[1.08fr_0.92fr] gap-12 lg:gap-16 items-center">
          <motion.div className="space-y-7" variants={staggerContainer} initial="initial" whileInView="animate" viewport={{ once: true }}>
            <motion.div variants={fadeInUp}>
              <span className="inline-block px-3 py-1 rounded-full bg-brand-green/10 text-brand-green text-xs font-semibold tracking-wide uppercase mb-4">
                Accounting and outsourcing services
              </span>
            </motion.div>
            <motion.h1 className="text-4xl sm:text-5xl lg:text-[3.25rem] font-extrabold text-brand-dark leading-tight tracking-tight" variants={fadeInUp}>
              Accounting, tax and back-office support your firm can actually rely on
            </motion.h1>
            <motion.p className="text-lg text-brand-gray max-w-2xl leading-relaxed" variants={fadeInUp}>
              We work with CPA firms, audit practices, tax firms and growing businesses that need dependable, reviewed finance support, without expanding their in-house team. Work is supervised by qualified accounting professionals and reviewed before it reaches you.
            </motion.p>
            <motion.div className="flex flex-col sm:flex-row gap-4" variants={fadeInUp}>
              <Button asChild>
                <a href="#contact">
                  Request a Consultation
                  <ArrowRight className="ml-2 -mr-1 w-4 h-4" aria-hidden="true" />
                </a>
              </Button>
              <Button variant="secondary" asChild>
                <a href="#services">See Our Services</a>
              </Button>
            </motion.div>
            <motion.p className="text-xs text-brand-gray" variants={fadeInUp}>
              Confidential. Clear scope. Reviewed delivery.
            </motion.p>
          </motion.div>

          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          >
            <div className="relative bg-white rounded-2xl shadow-2xl border border-brand-border/60 overflow-hidden">
              <div className="p-5 border-b border-brand-border/60 bg-brand-light">
                <p className="text-xs font-semibold uppercase tracking-widest text-brand-blue mb-2">
                  What we handle
                </p>
                <p className="text-base font-bold text-brand-dark">
                  Finance work for firms and businesses that need quality and consistency
                </p>
              </div>
              <div className="p-6 space-y-5">
                <div className="grid sm:grid-cols-2 gap-3">
                  {COVERAGE.map((item) => (
                    <div key={item} className="rounded-xl border border-brand-border/60 bg-brand-light p-3.5">
                      <CheckCircle className="w-4 h-4 text-brand-green mb-2" aria-hidden="true" />
                      <p className="text-sm font-medium text-brand-dark leading-snug">{item}</p>
                    </div>
                  ))}
                </div>
                <div className="rounded-xl bg-brand-light border border-brand-border/60 p-4 space-y-2.5">
                  <div className="flex items-center gap-2.5 text-sm text-brand-gray">
                    <FileCheck2 className="w-4 h-4 text-brand-green flex-shrink-0" aria-hidden="true" />
                    <span>Reviewed by senior finance professionals before delivery</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-sm text-brand-gray">
                    <ShieldCheck className="w-4 h-4 text-brand-blue flex-shrink-0" aria-hidden="true" />
                    <span>NDA-backed and suitable for firm and client work</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-sm text-brand-gray">
                    <Users className="w-4 h-4 text-brand-green flex-shrink-0" aria-hidden="true" />
                    <span>Consistent team assigned to your work</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
