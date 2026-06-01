import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCounterValue(value: number, decimals: number = 0): string {
  return value.toFixed(decimals);
}

export function getGradientClasses(gradient: 'green' | 'blue'): {
  bg: string;
  text: string;
  border: string;
} {
  return {
    green: {
      bg: 'bg-brand-green/10',
      text: 'text-brand-green',
      border: 'border-brand-green/30',
    },
    blue: {
      bg: 'bg-brand-blue/10',
      text: 'text-brand-blue',
      border: 'border-brand-blue/30',
    },
  }[gradient];
}