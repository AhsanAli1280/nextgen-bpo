'use client';

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { SectionHeading } from '@/components/ui/section-heading';
import { ServiceCard } from '@/components/ui/service-card';
import { Button } from '@/components/ui/button';
import { SERVICES } from '@/lib/data/services';
import { staggerContainer } from '@/lib/animations';

export function ServicesGrid() {
  return (
    <section id="services" className="py-20 lg:py-28 bg-white">
      <Container>
        <SectionHeading title="End-to-End Financial Operations" subtitle="Specialized services designed for accounting firms, SMEs, and finance leaders who demand precision and scalability." />
        <motion.div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8" variants={staggerContainer} initial="initial" whileInView="animate" viewport={{ once: true }}>
          {SERVICES.map((service, index) => (
            <ServiceCard key={service.id} service={service} index={index} />
          ))}
        </motion.div>
        <motion.div className="text-center mt-12" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }}>
          <Button variant="secondary" asChild><a href="#contact">Discuss Services <ArrowRight className="ml-2 w-4 h-4" aria-hidden="true" /></a></Button>
        </motion.div>
      </Container>
    </section>
  );
}
