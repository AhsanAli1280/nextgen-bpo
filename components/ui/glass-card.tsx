'use client';

import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';
import { hoverLift } from '@/lib/animations';

interface GlassCardProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
  gradient?: 'green' | 'blue' | 'none';
}

export function GlassCard({ children, className, hoverEffect = true, gradient = 'none', ...props }: GlassCardProps) {
  const gradientOverlays = {
    green: 'from-brand-green/5 to-transparent',
    blue: 'from-brand-blue/5 to-transparent',
    none: '',
  };
  
  return (
    <motion.div
      className={cn(
        'relative bg-white rounded-2xl p-6 shadow-sm border border-brand-border/60',
        hoverEffect && 'hover:shadow-xl hover:border-brand-green/30 transition-all duration-300',
        className
      )}
      whileHover={hoverEffect ? hoverLift.hover : undefined}
      {...props}
    >
      {children}
      {gradient !== 'none' && (
        <div className={cn(
          'absolute inset-0 rounded-2xl bg-gradient-to-br opacity-0 transition-opacity duration-300 pointer-events-none',
          gradientOverlays[gradient],
          'group-hover:opacity-100'
        )} />
      )}
    </motion.div>
  );
}