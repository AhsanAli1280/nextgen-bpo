import { Container } from '@/components/ui/container';
import { TRUST_STATEMENTS } from '@/lib/data/statistics';

export function Statistics() {
  return (
    <section className="py-16 lg:py-20 bg-gradient-to-r from-brand-blue to-brand-green relative overflow-hidden">
      <Container>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {TRUST_STATEMENTS.map((statement) => (
            <div
              key={statement.id}
              className="rounded-2xl border border-white/20 bg-white/10 p-6 backdrop-blur-sm"
            >
              <p className="text-base font-semibold text-white mb-2">{statement.label}</p>
              <p className="text-sm text-white/75 leading-relaxed">{statement.sublabel}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
