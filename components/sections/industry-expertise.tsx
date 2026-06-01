'use client';

import { motion } from 'framer-motion';
import { Building2, Briefcase, FileText, ShoppingCart, CheckCircle, ArrowRight, LucideIcon } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { SectionHeading } from '@/components/ui/section-heading';
import { INDUSTRIES } from '@/lib/data/industries';
import { getGradientClasses } from '@/lib/utils';

const ICON_MAP: Record<string, LucideIcon> = { Building2, Briefcase, FileText, ShoppingCart };

export function IndustryExpertise() {
  return (
    <section id="industries" className="py-20 lg:py-28 bg-brand-light">
      <Container>
        <SectionHeading
          title="Built for Firms and Finance Teams"
          subtitle="Specialized accounting, taxation, audit support, and back-office services for organizations that need dependable professional capacity."
        />
        <motion.div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6" variants={{ animate: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } } }} initial="initial" whileInView="animate" viewport={{ once: true }}>
          {INDUSTRIES.map((industry, index) => {
            const Icon = ICON_MAP[industry.icon] || Building2;
            const gradientClasses = getGradientClasses(industry.gradient);
            return (
              <motion.div key={industry.id} className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-brand-border/60 hover:border-brand-blue/30" initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }}>
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${gradientClasses.bg} ${gradientClasses.text} mb-5`}><Icon className="w-6 h-6" aria-hidden="true" /></div>
                <h3 className="text-lg font-semibold text-brand-dark mb-3">{industry.name}</h3>
                <ul className="space-y-2 mb-4">
                  {industry.useCases.map((useCase) => (
                    <li key={useCase} className="flex items-start text-sm text-brand-gray"><CheckCircle className="w-4 h-4 text-brand-green mr-2 mt-0.5 flex-shrink-0" aria-hidden="true" /><span>{useCase}</span></li>
                  ))}
                </ul>
                <div className="flex items-center justify-between pt-4 border-t border-brand-border/60">
                  <span className="text-xs font-medium text-brand-gray">{industry.clientCount}</span>
                  <ArrowRight className={`w-4 h-4 ${gradientClasses.text} transform group-hover:translate-x-1 transition-transform`} aria-hidden="true" />
                </div>
              </motion.div>
            );
          })}
        </motion.div>
        <motion.p className="text-center text-sm text-brand-gray mt-8" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.3 }}>
          Not seeing your industry?{' '}
          <a href="#contact" className="text-brand-blue hover:text-brand-dark font-medium">We can scope the right support for your team -&gt;</a>
        </motion.p>
      </Container>
    </section>
  );
}
