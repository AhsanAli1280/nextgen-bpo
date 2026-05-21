'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Shield, CheckCircle, Users } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Button } from '@/components/ui/button';
import { fadeInUp, staggerContainer } from '@/lib/animations';

export function Hero() {
  return (
    <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-brand-blue/5 via-transparent to-brand-green/5 pointer-events-none" />
      <motion.div className="absolute top-20 right-0 w-1/2 h-1/2 bg-gradient-to-br from-brand-green/10 to-transparent rounded-full blur-3xl opacity-40" animate={{ y: [0, -10, 0] }} transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }} />
      <motion.div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-gradient-to-tr from-brand-blue/10 to-transparent rounded-full blur-3xl opacity-40" animate={{ y: [0, 10, 0] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1 }} />
      
      <Container>
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <motion.div className="space-y-8" variants={staggerContainer} initial="initial" whileInView="animate" viewport={{ once: true }}>
            <motion.h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-brand-dark leading-tight tracking-tight" variants={fadeInUp}>
              Precision Financial Operations,{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-green to-brand-blue">Delivered Globally</span>
            </motion.h1>
            <motion.p className="text-lg text-brand-gray max-w-xl leading-relaxed" variants={fadeInUp}>
              NextGen BPO Solutions delivers US taxation, bookkeeping, and financial modeling services with ISO-certified processes and 99.7% accuracy—so you can focus on growth, not grunt work.
            </motion.p>
            <motion.div className="flex flex-col sm:flex-row gap-4" variants={fadeInUp}>
              <Button asChild>
                <a href="#contact">Get Your Custom Proposal <ArrowRight className="ml-2 -mr-1 w-4 h-4" aria-hidden="true" /></a>
              </Button>
              <Button variant="secondary" asChild>
                <a href="#process">View Our Process</a>
              </Button>
            </motion.div>
            <motion.div className="flex flex-wrap items-center gap-4 pt-2" variants={fadeInUp}>
              <div className="flex items-center space-x-2 text-xs font-medium text-brand-gray"><CheckCircle className="w-4 h-4 text-brand-green" aria-hidden="true" /><span>99.7% Accuracy Rate</span></div>
              <div className="flex items-center space-x-2 text-xs font-medium text-brand-gray"><Shield className="w-4 h-4 text-brand-blue" aria-hidden="true" /><span>SOC 2-Aligned Security</span></div>
              <div className="flex items-center space-x-2 text-xs font-medium text-brand-gray"><Users className="w-4 h-4 text-brand-green" aria-hidden="true" /><span>200+ Global Clients</span></div>
            </motion.div>
            <motion.p className="text-xs text-brand-gray pt-2" variants={fadeInUp}>No credit card required • 15-min consultation • Confidential</motion.p>
          </motion.div>
          
          <motion.div className="relative lg:pl-8" initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}>
            <motion.div className="relative bg-white rounded-2xl shadow-2xl border border-brand-border/60 overflow-hidden" whileHover={{ scale: 1.02 }} transition={{ duration: 0.3 }}>
              <div className="p-4 border-b border-brand-border/60 bg-gradient-to-r from-brand-light to-white flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-400" /><div className="w-2.5 h-2.5 rounded-full bg-yellow-400" /><div className="w-2.5 h-2.5 rounded-full bg-green-400" />
                </div>
                <span className="text-xs font-mono text-brand-gray">client-portal.nextgenbpo.com</span>
              </div>
              <div className="p-6 space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-brand-light rounded-xl p-4 border border-brand-border/40"><p className="text-xs font-medium text-brand-gray mb-1">Accuracy Rate</p><p className="text-2xl font-bold text-brand-dark font-mono">99.7<span className="text-brand-green">%</span></p></div>
                  <div className="bg-brand-light rounded-xl p-4 border border-brand-border/40"><p className="text-xs font-medium text-brand-gray mb-1">Avg. Turnaround</p><p className="text-2xl font-bold text-brand-dark font-mono">48<span className="text-brand-blue">h</span></p></div>
                </div>
                <div className="h-32 bg-gradient-to-br from-brand-green/10 to-brand-blue/10 rounded-xl flex items-center justify-center border-2 border-dashed border-brand-border">
                  <span className="text-sm text-brand-gray font-medium">Real-time Delivery Analytics</span>
                </div>
                <div className="space-y-3">
                  {[{ label: 'Tax Returns Filed', value: '1,247' }, { label: 'Books Reconciled', value: '892' }, { label: 'Reports Generated', value: '2,103' }].map((item) => (
                    <div key={item.label} className="flex items-center justify-between text-sm"><span className="text-brand-gray">{item.label}</span><span className="font-semibold text-brand-dark">{item.value}</span></div>
                  ))}
                </div>
              </div>
            </motion.div>
            <motion.div className="absolute -top-4 -right-4 w-24 h-24 bg-brand-green/20 rounded-2xl blur-2xl" animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 4, repeat: Infinity }} />
            <motion.div className="absolute -bottom-6 -left-6 w-32 h-32 bg-brand-blue/20 rounded-2xl blur-2xl" animate={{ scale: [1.1, 1, 1.1] }} transition={{ duration: 4, repeat: Infinity, delay: 2 }} />
          </motion.div>
        </div>
      </Container>
    </section>
  );
}