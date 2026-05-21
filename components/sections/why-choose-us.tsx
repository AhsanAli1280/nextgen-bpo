'use client';

import { motion } from 'framer-motion';
import { Shield, Zap, Clock, BarChart2, Star } from 'lucide-react';
import { Container } from '@/components/ui/container';

const VALUE_PROPS = [
  {
    icon: Shield,
    title: 'Enterprise-Grade Security',
    description: 'SOC 2-aligned protocols, end-to-end encryption, and audit-ready documentation—your data stays protected, always.',
    gradient: 'green',
  },
  {
    icon: Zap,
    title: 'Seamless Integration',
    description: 'We adapt to your stack—QuickBooks, Xero, NetSuite, Excel, or custom APIs—with zero disruption to your workflows.',
    gradient: 'blue',
  },
  {
    icon: Clock,
    title: '24/7 Dedicated Support',
    description: 'Your dedicated account manager and support team are always available—no time zones, no delays, no excuses.',
    gradient: 'green',
  },
  {
    icon: BarChart2,
    title: 'Measurable ROI',
    description: 'Reduce operational costs by up to 60% while improving accuracy, speed, and client satisfaction—tracked in real-time dashboards.',
    gradient: 'blue',
  },
];

export function WhyChooseUs() {
  return (
    <section id="about" className="py-20 lg:py-28 bg-brand-light">
      <Container>
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Content Column */}
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-brand-dark mb-4">
                Why Finance Leaders Choose NextGen
              </h2>
              <p className="text-lg text-brand-gray">
                We combine global talent, enterprise-grade security, and SaaS-like agility to deliver outsourcing that feels like an upgrade—not a compromise.
              </p>
            </div>

            <div className="space-y-6">
              {VALUE_PROPS.map((prop, index) => {
                const Icon = prop.icon;
                const gradientClasses =
                  prop.gradient === 'green'
                    ? 'bg-brand-green/10 text-brand-green'
                    : 'bg-brand-blue/10 text-brand-blue';

                return (
                  <motion.div
                    key={prop.title}
                    className="flex items-start space-x-4"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className={`flex-shrink-0 w-10 h-10 rounded-lg ${gradientClasses} flex items-center justify-center`}>
                      <Icon className="w-5 h-5" aria-hidden="true" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-brand-dark mb-1">{prop.title}</h3>
                      <p className="text-brand-gray text-sm">{prop.description}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Visual Column */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="relative bg-white rounded-2xl shadow-xl border border-brand-border/60 overflow-hidden">
              <div className="aspect-[16/9] bg-gradient-to-br from-brand-blue/10 to-brand-green/10 flex items-center justify-center">
                <div className="text-center p-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-green to-brand-blue text-white mb-4">
                    <Shield className="w-8 h-8" aria-hidden="true" />
                  </div>
                  <p className="text-brand-gray text-sm">Enterprise Security Dashboard</p>
                </div>
              </div>
              
              {/* ✅ FIXED: High-contrast rating card (dark text on light glass) */}
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
                <div className="bg-white/95 backdrop-blur-md rounded-xl p-4 border border-white/20 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-brand-gray mb-0.5">Client Satisfaction</p>
                      <p className="text-2xl font-bold text-brand-dark">4.9<span className="text-lg text-brand-gray font-normal">/5.0</span></p>
                    </div>
                    <div className="flex text-yellow-400" aria-label="4.9 out of 5 stars">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-current" aria-hidden="true" />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative Blur Blobs */}
            <motion.div
              className="absolute -top-6 -right-6 w-32 h-32 bg-brand-green/20 rounded-2xl blur-2xl"
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 6, repeat: Infinity }}
            />
            <motion.div
              className="absolute -bottom-8 -left-8 w-40 h-40 bg-brand-blue/20 rounded-2xl blur-2xl"
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 6, repeat: Infinity, delay: 1 }}
            />
          </motion.div>
        </div>
      </Container>
    </section>
  );
}