'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Calculator, ArrowRight, ShieldCheck } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Button } from '@/components/ui/button';
import { fadeInUp } from '@/lib/animations';

export function CalculatorPromo() {
  return (
    <section className="py-20 lg:py-24 bg-brand-light">
      <Container>
        <motion.div
          className="bg-brand-dark rounded-2xl p-8 sm:p-12 shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-8"
          variants={fadeInUp}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
        >
          <div className="flex items-start gap-4 max-w-2xl">
            <div className="hidden sm:flex w-12 h-12 rounded-xl bg-brand-green/15 items-center justify-center flex-shrink-0">
              <Calculator className="w-6 h-6 text-brand-green" aria-hidden="true" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-brand-green mb-3 flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5" aria-hidden="true" />
                Free Tool
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3 leading-tight">
                Pakistan Withholding Tax Calculator
              </h2>
              <p className="text-white/75 leading-relaxed">
                Calculate withholding taxes instantly using Finance Act 2025 rates with full calculation transparency.
              </p>
            </div>
          </div>

          <Button asChild size="lg" className="flex-shrink-0">
            <Link href="/wht-calculator">
              Launch Calculator
              <ArrowRight className="ml-2 -mr-1 w-4 h-4" aria-hidden="true" />
            </Link>
          </Button>
        </motion.div>
      </Container>
    </section>
  );
}
