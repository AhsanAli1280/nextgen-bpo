'use client';

import { motion } from 'framer-motion';
import { Calendar, Users, FileCheck2, TrendingUp, LucideIcon } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { SectionHeading } from '@/components/ui/section-heading';
import { Button } from '@/components/ui/button';
import { PROCESS_STEPS } from '@/lib/data/process';

const ICON_MAP: Record<string, LucideIcon> = { Calendar, Users, FileCheck2, TrendingUp };

export function ProcessWorkflow() {
  return (
    <section id="process" className="py-20 lg:py-28 bg-white">
      <Container>
        <SectionHeading
          title="How an engagement works"
          subtitle="A straightforward process for getting accounting, tax, payroll or back-office work done properly. Every engagement has a clear scope, a consistent team, and senior review at every step."
        />
        <div className="hidden lg:block relative">
          <div className="absolute top-8 left-0 right-0 h-0.5 bg-gradient-to-r from-brand-green via-brand-blue to-brand-green" />
          <div className="grid grid-cols-4 gap-8 relative">
            {PROCESS_STEPS.map((step, index) => {
              const Icon = ICON_MAP[step.icon] || Calendar;
              const borderColor = index % 2 === 0 ? 'border-brand-green' : 'border-brand-blue';
              const bgColor = index % 2 === 0 ? 'bg-brand-green/10 text-brand-green' : 'bg-brand-blue/10 text-brand-blue';
              return (
                <motion.div key={step.step} className="relative text-center group" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }}>
                  <motion.div className={`relative z-10 w-16 h-16 mx-auto rounded-2xl bg-white border-4 ${borderColor} flex items-center justify-center shadow-lg`} whileHover={{ scale: 1.1 }} transition={{ duration: 0.2 }}>
                    <span className={`text-2xl font-bold ${index % 2 === 0 ? 'text-brand-green' : 'text-brand-blue'}`}>{step.step}</span>
                  </motion.div>
                  <div className="mt-6">
                    <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl ${bgColor} mb-4 mx-auto`}><Icon className="w-5 h-5" aria-hidden="true" /></div>
                    <h3 className="text-lg font-semibold text-brand-dark mb-2">{step.title}</h3>
                    <p className="text-brand-gray text-sm">{step.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
        <div className="lg:hidden space-y-8 relative">
          <div className="absolute left-8 top-4 bottom-4 w-0.5 bg-gradient-to-b from-brand-green to-brand-blue" />
          {PROCESS_STEPS.map((step, index) => {
            const Icon = ICON_MAP[step.icon] || Calendar;
            const borderColor = index % 2 === 0 ? 'border-brand-green' : 'border-brand-blue';
            const bgColor = index % 2 === 0 ? 'bg-brand-green/10 text-brand-green' : 'bg-brand-blue/10 text-brand-blue';
            return (
              <motion.div key={step.step} className="relative pl-20" initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }}>
                <div className={`absolute left-0 top-0 w-16 h-16 rounded-2xl bg-white border-4 ${borderColor} flex items-center justify-center shadow-lg`}><span className={`text-2xl font-bold ${index % 2 === 0 ? 'text-brand-green' : 'text-brand-blue'}`}>{step.step}</span></div>
                <div><div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl ${bgColor} mb-4`}><Icon className="w-5 h-5" aria-hidden="true" /></div><h3 className="text-lg font-semibold text-brand-dark mb-2">{step.title}</h3><p className="text-brand-gray text-sm">{step.description}</p></div>
              </motion.div>
            );
          })}
        </div>
        <motion.div className="text-center mt-12" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.4 }}>
          <Button asChild><a href="#contact">Request a Consultation <FileCheck2 className="ml-2 -mr-1 w-4 h-4" aria-hidden="true" /></a></Button>
        </motion.div>
      </Container>
    </section>
  );
}
