'use client';

import { Container } from '@/components/ui/container';
import { SectionHeading } from '@/components/ui/section-heading';
import { TestimonialCard } from '@/components/ui/testimonial-card';
import { TESTIMONIALS } from '@/lib/data/testimonials';

export function Testimonials() {
  return (
    <section className="py-20 lg:py-28 bg-white">
      <Container>
        <SectionHeading
          title="What Our Clients Say"
          subtitle="Feedback from accounting firms, finance teams and businesses that work with us."
        />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {TESTIMONIALS.map((testimonial) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} />
          ))}
        </div>
      </Container>
    </section>
  );
}
