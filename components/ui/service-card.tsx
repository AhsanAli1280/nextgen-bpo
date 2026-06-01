'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, FileText, ClipboardList, Users, Workflow, Lightbulb, BarChart3, Table2, TrendingUp, Settings, LucideIcon, BookOpenCheck, FileCheck2, Landmark, Briefcase } from 'lucide-react';
import { cn, getGradientClasses } from '@/lib/utils';

interface ServiceCardProps {
  service: {
    id: string;
    title: string;
    description: string;
    icon: string;
    gradient: 'green' | 'blue';
    href?: string;
  };
  className?: string;
  index?: number;
}

const ICON_MAP: Record<string, LucideIcon> = {
  FileText,
  ClipboardList,
  Users,
  Workflow,
  Lightbulb,
  BarChart3,
  Table2,
  TrendingUp,
  Settings,
  BookOpenCheck,
  FileCheck2,
  Landmark,
  Briefcase,
};

function scrollToContact(e: React.MouseEvent<HTMLAnchorElement>) {
  e.preventDefault();
  const el = document.getElementById('contact');
  if (el) el.scrollIntoView({ behavior: 'smooth' });
}

export function ServiceCard({ service, className, index = 0 }: ServiceCardProps) {
  const { title, description, icon, gradient, href } = service;
  const gradientClasses = getGradientClasses(gradient);
  const IconComponent = ICON_MAP[icon] || FileText;
  const isServicePage = href && !href.startsWith('#');

  return (
    <motion.div
      className={cn(
        'group relative bg-white rounded-2xl p-6 shadow-sm hover:shadow-md border border-brand-border/60 hover:border-brand-green/30 transition-all duration-300',
        className
      )}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.div
        className={cn(
          'inline-flex items-center justify-center w-12 h-12 rounded-xl mb-5 transition-transform duration-300',
          gradientClasses.bg, gradientClasses.text, 'group-hover:scale-110'
        )}
      >
        <IconComponent className="w-6 h-6" aria-hidden="true" />
      </motion.div>

      <h3 className={cn('text-lg font-semibold text-brand-dark mb-2 transition-colors', 'group-hover:text-brand-green')}>
        {title}
      </h3>
      <p className="text-brand-gray text-sm leading-relaxed mb-4">
        {description}
      </p>

      <div className={cn('flex items-center text-sm font-medium transition-colors', gradientClasses.text, 'group-hover:text-brand-green')}>
        {isServicePage ? (
          <Link href={href as string} className="inline-flex items-center">
            Learn more
            <ArrowRight className="ml-1.5 w-4 h-4 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
          </Link>
        ) : (
          <a href="#contact" onClick={scrollToContact} className="inline-flex items-center">
            Get in touch
            <ArrowRight className="ml-1.5 w-4 h-4 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
          </a>
        )}
      </div>

      <div className={cn(
        'absolute inset-0 rounded-2xl bg-gradient-to-br opacity-0 transition-opacity duration-300 pointer-events-none',
        gradient === 'green' ? 'from-brand-green/5 to-transparent' : 'from-brand-blue/5 to-transparent',
        'group-hover:opacity-100'
      )} />
    </motion.div>
  );
}
