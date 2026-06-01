'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { fadeInUp } from '@/lib/animations';

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  align?: 'left' | 'center' | 'right';
  className?: string;
}

export function SectionHeading({ title, subtitle, align = 'center', className }: SectionHeadingProps) {
  const alignments = {
    left: 'text-left items-start',
    center: 'text-center items-center',
    right: 'text-right items-end',
  };

  return (
    <motion.div 
      className={cn('max-w-3xl mx-auto mb-12 flex flex-col', alignments[align], className)}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true, amount: 0.1 }}
      variants={fadeInUp}
    >
      <h2 className="text-3xl sm:text-4xl font-bold text-brand-dark mb-4">
        {title}
      </h2>
      {subtitle && (
        <p className="text-lg text-brand-gray">
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}