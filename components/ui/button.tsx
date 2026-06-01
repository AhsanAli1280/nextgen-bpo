'use client';

import React, { cloneElement, forwardRef, isValidElement } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';
import { hoverLift } from '@/lib/animations';

export interface ButtonProps extends HTMLMotionProps<'button'> {
  asChild?: boolean;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ asChild = false, className, variant = 'primary', size = 'md', children, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
    
    const variants = {
      primary: 'text-white bg-brand-green shadow-brand hover:shadow-2xl focus:ring-brand-green/50',
      secondary: 'text-brand-blue bg-white border border-brand-blue/20 hover:bg-brand-blue/5 focus:ring-brand-blue/50',
      ghost: 'text-brand-gray hover:text-brand-dark focus:ring-brand-gray/50',
    };
    
    const sizes = {
      sm: 'px-4 py-2 text-sm',
      md: 'px-6 py-3.5 text-sm',
      lg: 'px-8 py-4 text-base',
    };

    const buttonClassName = cn(baseStyles, variants[variant], sizes[size], className);

    if (asChild && isValidElement<{ className?: string }>(children)) {
      const { whileHover, whileTap, ...spanProps } = props;

      return (
        <motion.span
          className="inline-flex"
          whileHover={whileHover ?? hoverLift.hover}
          whileTap={whileTap}
          {...spanProps}
        >
          {cloneElement(children, {
            className: cn(buttonClassName, children.props.className),
          })}
        </motion.span>
      );
    }
    
    return (
      <motion.button
        ref={ref}
        className={buttonClassName}
        whileHover={hoverLift.hover}
        {...props}
      >
        {children}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';
