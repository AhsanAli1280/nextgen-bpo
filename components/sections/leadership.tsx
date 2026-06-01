'use client';

import { motion } from 'framer-motion';
import {
  FileText,
  ClipboardCheck,
  Users,
  ShieldCheck,
  BarChart3,
  BookOpen,
  CheckCircle,
  GraduationCap,
} from 'lucide-react';
import { Container } from '@/components/ui/container';
import { SectionHeading } from '@/components/ui/section-heading';
import { fadeInUp, staggerContainer } from '@/lib/animations';

const DISCIPLINES = [
  {
    icon: BookOpen,
    title: 'Accounting and Bookkeeping',
    body: 'Professionals experienced in ledger maintenance, reconciliations, AP/AR, month-end close, and management account preparation across multiple clients and jurisdictions.',
    gradient: 'green',
  },
  {
    icon: FileText,
    title: 'US and Pakistan Taxation',
    body: 'Tax professionals with hands-on experience in US individual and business tax preparation support and Pakistan income tax, sales tax and withholding tax compliance.',
    gradient: 'blue',
  },
  {
    icon: ClipboardCheck,
    title: 'Audit and Workpaper Support',
    body: 'Team members experienced in audit file organisation, PBC tracking, schedule preparation, workpaper indexing and supporting audit firms with production-level tasks.',
    gradient: 'blue',
  },
  {
    icon: BarChart3,
    title: 'Financial Reporting and FP&A',
    body: 'Professionals who prepare MIS packs, financial statements, cash flow reports, variance commentary and board-ready finance summaries for management and investor use.',
    gradient: 'green',
  },
  {
    icon: Users,
    title: 'Payroll and Compliance',
    body: 'Payroll specialists handling input preparation, gross-to-net support, compliance calendars, employee records and payroll journal entries for businesses and multi-client firms.',
    gradient: 'green',
  },
  {
    icon: GraduationCap,
    title: 'Corporate Advisory Support',
    body: 'Finance professionals assisting with business planning, financial modelling, internal controls documentation and management reporting for growing companies.',
    gradient: 'blue',
  },
];

const STANDARDS = [
  {
    icon: CheckCircle,
    label: 'CA-supervised delivery',
    detail: 'All client work is supervised by qualified accounting professionals before it leaves the team.',
  },
  {
    icon: ClipboardCheck,
    label: 'Structured review process',
    detail: 'Every deliverable goes through a documented review and sign-off step, not just a self-check.',
  },
  {
    icon: ShieldCheck,
    label: 'Confidentiality by design',
    detail: 'NDA-backed workflows, access controls, and clear handoff documentation across all engagements.',
  },
  {
    icon: Users,
    label: 'Consistent named support',
    detail: 'Clients work with a consistent team rather than a rotating pool, so context and standards are preserved.',
  },
];

export function Leadership() {
  return (
    <section id="our-team" className="py-20 lg:py-28 bg-white">
      <Container>
        <SectionHeading
          title="Our Team"
          subtitle="NextGen BPO Solutions is staffed by accounting, taxation, payroll and finance professionals who work across CPA firms, audit practices, tax practices and growing businesses worldwide."
        />

        {/* Team overview panel */}
        <motion.div
          className="rounded-2xl border border-brand-border/60 bg-gradient-to-br from-brand-light to-white p-8 mb-12"
          variants={fadeInUp}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
        >
          <div className="grid lg:grid-cols-[1fr_1.6fr] gap-8 items-center">
            <div>
              <span className="inline-block px-3 py-1 rounded-full bg-brand-green/10 text-brand-green text-xs font-semibold tracking-wide uppercase mb-4">
                Professional services team
              </span>
              <h3 className="text-2xl font-bold text-brand-dark mb-3">
                Qualified professionals across accounting, tax and finance
              </h3>
              <p className="text-brand-gray leading-relaxed text-sm">
                Our team includes qualified and experienced accounting, taxation and finance professionals. Work is not handled by generalists or entry-level staff operating unsupervised. Work is structured around discipline areas, reviewed by senior members, and delivered under documented standards appropriate for firms and finance teams that rely on accuracy and confidentiality.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Accounting and bookkeeping professionals' },
                { label: 'US and Pakistan taxation specialists' },
                { label: 'Payroll and compliance support staff' },
                { label: 'Audit and workpaper support team' },
                { label: 'Financial reporting and FP&A professionals' },
                { label: 'Senior reviewers across all disciplines' },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-start gap-2.5 rounded-xl bg-white border border-brand-border/60 p-3 shadow-sm"
                >
                  <CheckCircle className="w-4 h-4 text-brand-green flex-shrink-0 mt-0.5" aria-hidden="true" />
                  <span className="text-xs font-medium text-brand-dark leading-snug">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Disciplines grid */}
        <motion.div
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-14"
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
        >
          {DISCIPLINES.map((item, index) => {
            const Icon = item.icon;
            const iconBg = item.gradient === 'green'
              ? 'bg-brand-green/10 text-brand-green'
              : 'bg-brand-blue/10 text-brand-blue';
            return (
              <motion.div
                key={item.title}
                className="rounded-2xl border border-brand-border/60 bg-white p-6 shadow-sm hover:shadow-md transition-shadow duration-200"
                variants={fadeInUp}
                transition={{ delay: index * 0.07 }}
              >
                <div className={`inline-flex h-11 w-11 items-center justify-center rounded-xl mb-4 ${iconBg}`}>
                  <Icon className="w-5 h-5" aria-hidden="true" />
                </div>
                <h3 className="text-base font-semibold text-brand-dark mb-2">{item.title}</h3>
                <p className="text-sm text-brand-gray leading-relaxed">{item.body}</p>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Delivery standards row */}
        <div className="rounded-2xl bg-brand-dark overflow-hidden">
          <div className="p-6 border-b border-white/10">
            <p className="text-sm font-semibold text-white">
              How we deliver: standards applied across every engagement
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-white/10">
            {STANDARDS.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="p-6">
                  <Icon className="w-5 h-5 text-brand-green mb-3" aria-hidden="true" />
                  <p className="text-sm font-semibold text-white mb-1">{item.label}</p>
                  <p className="text-xs text-white/60 leading-relaxed">{item.detail}</p>
                </div>
              );
            })}
          </div>
        </div>

      </Container>
    </section>
  );
}
