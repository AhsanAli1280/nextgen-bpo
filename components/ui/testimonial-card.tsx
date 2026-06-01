'use client';

import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';
import { cn } from '@/lib/utils';
import { fadeInUp } from '@/lib/animations';
import { Testimonial } from '@/types';

interface TestimonialCardProps {
  testimonial: Testimonial;
  className?: string;
}

export function TestimonialCard({ testimonial, className }: TestimonialCardProps) {
  const { quote, author, role, company, initials, gradient } = testimonial;
  
  return (
    <motion.div
      className={cn(
        'bg-brand-light rounded-2xl p-6 border border-brand-border/60 hover:border-brand-green/30 hover:shadow-md transition-all duration-300',
        className
      )}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true }}
      variants={fadeInUp}
    >
      <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white text-brand-green mb-4">
        <Quote className="w-5 h-5" aria-hidden="true" />
      </div>
      
      <blockquote className="text-brand-dark text-sm leading-relaxed mb-6">
        &ldquo;{quote}&rdquo;
      </blockquote>
      
      <div className="flex items-center">
        <div className={cn(
          'flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-semibold',
          gradient === 'green' ? 'bg-brand-green/10 text-brand-green' : 'bg-brand-blue/10 text-brand-blue'
        )}>
          {initials}
        </div>
        <div className="ml-3">
          <p className="text-sm font-semibold text-brand-dark">{author}</p>
          <p className="text-xs text-brand-gray">{role}, {company}</p>
        </div>
      </div>
    </motion.div>
  );
}
