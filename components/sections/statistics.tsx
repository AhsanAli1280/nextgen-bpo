'use client';

import { Container } from '@/components/ui/container';
import { AnimatedCounter } from '@/components/ui/animated-counter';
import { STATISTICS } from '@/lib/data/statistics';

export function Statistics() {
  return (
    <section className="py-16 bg-gradient-to-r from-brand-blue to-brand-green relative overflow-hidden animate-gradient-bg">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full mix-blend-overlay filter blur-3xl blob" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full mix-blend-overlay filter blur-3xl blob" />
      </div>
      <Container>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {STATISTICS.map((stat) => (
            <div key={stat.id} className="text-center">
              <div className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-2 font-mono">
                <AnimatedCounter value={stat.value} suffix={stat.suffix} decimals={stat.decimals} />
              </div>
              <p className="text-lg font-semibold text-white/90 mb-1">{stat.label}</p>
              <p className="text-sm text-white/70">{stat.sublabel}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}