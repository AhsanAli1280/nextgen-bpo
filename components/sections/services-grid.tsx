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
        <SectionHeading
          title="Accounting, Taxation and Back-Office Services"
          subtitle="Professional outsourcing support for CPA firms, audit firms, tax practices, SMEs, and growing finance teams."
        />
        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
        >
          {SERVICES.map((service, index) => (
            <ServiceCard key={service.id} service={service} index={index} />
          ))}
        </motion.div>
        <motion.div
          className="text-center mt-10"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <Button variant="secondary" asChild>
            <a href="#contact">
              Discuss Your Service Needs
              <ArrowRight className="ml-2 w-4 h-4" aria-hidden="true" />
            </a>
          </Button>
        </motion.div>
      </Container>
    </section>
  );
}
