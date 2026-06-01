'use client';

import { motion } from 'framer-motion';
import { Shield, ClipboardCheck, UserCheck, FileSearch, BadgeCheck } from 'lucide-react';
import { Container } from '@/components/ui/container';

const VALUE_PROPS = [
  {
    icon: ClipboardCheck,
    title: 'Work is reviewed before it reaches you',
    description: 'Bookkeeping, tax, payroll, reporting, and audit support goes through a senior review step. You receive cleaner, checked deliverables, not first drafts.',
    gradient: 'green',
  },
  {
    icon: UserCheck,
    title: 'The same people handle your work',
    description: 'We assign a consistent team to your work, not a rotating pool. They learn your deadlines, formats, client preferences, and review expectations over time.',
    gradient: 'blue',
  },
  {
    icon: Shield,
    title: 'Client data stays confidential',
    description: 'NDA-backed workflows, restricted system access, documented handoffs, and clear data responsibility, whether you are a CPA firm, a business, or handling client files.',
    gradient: 'green',
  },
  {
    icon: FileSearch,
    title: 'Broad accounting and tax experience',
    description: 'We cover bookkeeping, financial reporting, US tax preparation support, Pakistan taxation, audit schedules, payroll processing, and back-office operations.',
    gradient: 'blue',
  },
];

export function WhyChooseUs() {
  return (
    <section id="about" className="py-20 lg:py-28 bg-brand-light">
      <Container>
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div>
              <span className="inline-block px-3 py-1 rounded-full bg-brand-blue/10 text-brand-blue text-xs font-semibold tracking-wide uppercase mb-4">
                Why firms work with us
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-brand-dark mb-4">
                Accounting support that is actually safe to delegate
              </h2>
              <p className="text-lg text-brand-gray">
                Most outsourcing breaks down because scope, review, and confidentiality are vague. We build those controls in from the start. You know exactly what is being done, by whom, and how it is checked.
              </p>
            </div>

            <div className="space-y-6">
              {VALUE_PROPS.map((prop, index) => {
                const Icon = prop.icon;
                const iconClass = prop.gradient === 'green'
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
                    <div className={`flex-shrink-0 w-10 h-10 rounded-lg ${iconClass} flex items-center justify-center`}>
                      <Icon className="w-5 h-5" aria-hidden="true" />
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-brand-dark mb-1">{prop.title}</h3>
                      <p className="text-brand-gray text-sm leading-relaxed">{prop.description}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="relative bg-white rounded-2xl shadow-xl border border-brand-border/60 overflow-hidden">
              <div className="p-6 border-b border-brand-border/60">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-brand-green/10 text-brand-green mb-4">
                  <BadgeCheck className="w-7 h-7" aria-hidden="true" />
                </div>
                <h3 className="text-xl font-bold text-brand-dark mb-2">How we run every engagement</h3>
                <p className="text-brand-gray text-sm leading-relaxed">
                  Clear scope, named team, senior review, and documented handoffs, applied consistently and not just when it is convenient.
                </p>
              </div>
              <div className="grid sm:grid-cols-2 gap-0">
                {[
                  'Qualified professional supervision',
                  'Reviewer notes on every deliverable',
                  'Documented handoffs',
                  'NDA-backed confidentiality',
                ].map((item) => (
                  <div key={item} className="p-6 border-t sm:border-r border-brand-border/60">
                    <p className="text-sm font-medium text-brand-dark">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
