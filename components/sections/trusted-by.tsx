'use client';

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { SectionHeading } from '@/components/ui/section-heading';
import { fadeInUp, staggerContainer } from '@/lib/animations';

export function TrustedBy() {
  const logos = ['CLIENT', 'PARTNER', 'FIRM', 'GROUP', 'CORP', 'VENTURES'];
  
  return (
    <section className="py-16 bg-brand-light border-y border-brand-border/60">
      <Container>
        <SectionHeading title="Trusted by Accounting Leaders Worldwide" subtitle="From boutique CPA firms to enterprise finance teams, we deliver precision at scale." />
        <motion.div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 items-center justify-items-center" variants={staggerContainer} initial="initial" whileInView="animate" viewport={{ once: true }}>
          {logos.map((logo, index) => (
            <motion.div key={logo} className="group flex items-center justify-center p-4 rounded-xl hover:bg-white hover:shadow-md transition-all duration-200 border border-transparent hover:border-brand-border/60 w-full" custom={index} variants={fadeInUp} whileHover={{ scale: 1.05 }}>
              <div className="h-8 flex items-center"><div className={`h-6 w-auto text-brand-gray opacity-60 group-hover:opacity-100 transition-all flex items-center justify-center px-3 py-1 bg-slate-100 rounded text-xs font-bold`}>{logo}</div></div>
            </motion.div>
          ))}
        </motion.div>
        <motion.div className="text-center mt-10" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.5 }}>
          <a href="#contact" className="inline-flex items-center text-sm font-medium text-brand-blue hover:text-brand-dark transition-colors">Join our network of successful partners <ArrowRight className="ml-1.5 w-4 h-4" aria-hidden="true" /></a>
        </motion.div>
      </Container>
    </section>
  );
}