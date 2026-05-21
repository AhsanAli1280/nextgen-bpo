'use client';

import { motion } from 'framer-motion';
import { Phone, ArrowRight } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Button } from '@/components/ui/button';
import { CONTACT } from '@/lib/constants';
import { fadeInUp } from '@/lib/animations';

export function CTABanner() {
  return (
    <section id="contact" className="py-16 animate-gradient-bg relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-white rounded-full mix-blend-overlay filter blur-3xl blob" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-white rounded-full mix-blend-overlay filter blur-3xl blob" />
      </div>
      <Container>
        <motion.div className="text-center relative" variants={fadeInUp} initial="initial" whileInView="animate" viewport={{ once: true }}>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Ready to Transform Your Finance Operations?</h2>
          <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">Start with a no-obligation consultation. We&apos;ll map your needs, outline a pilot scope, and show you exactly how NextGen can drive measurable ROI.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-6">
            <Button variant="secondary" asChild><a href={`mailto:${CONTACT.email}`}>Get Your Custom Proposal <ArrowRight className="ml-2 -mr-1 w-4 h-4" aria-hidden="true" /></a></Button>
            <Button className="bg-white/10 border border-white/20 text-white hover:bg-white/20" asChild><a href={`tel:${CONTACT.phone.replace(/[^+\d]/g, '')}`}><Phone className="w-4 h-4 mr-2" aria-hidden="true" />Book a 15-Min Call</a></Button>
          </div>
          <p className="text-sm text-white/70">No credit card required • 15-minute consultation • Confidential discussion</p>
        </motion.div>
      </Container>
    </section>
  );
}
