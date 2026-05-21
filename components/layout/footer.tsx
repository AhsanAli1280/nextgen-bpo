import Link from 'next/link';
import { Linkedin, Twitter, Phone, Mail, MapPin } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { FOOTER_LINKS } from '@/lib/data/navigation';
import { CONTACT, BRAND } from '@/lib/constants';

export function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-brand-dark text-white pt-16 pb-8">
      <Container>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 lg:gap-12 pb-12 border-b border-white/10">
          <div className="col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center space-x-3 mb-4" aria-label="Home">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-green to-brand-blue flex items-center justify-center">
                <span className="text-white font-bold text-lg">N</span>
              </div>
              <span className="text-xl font-bold tracking-tight">NEXTGEN<span className="text-brand-green">BPO</span></span>
            </Link>
            <p className="text-white/70 text-sm mb-6">{BRAND.tagline}</p>
            <div className="flex space-x-4">
              <a href="#" className="text-white/70 hover:text-white transition-colors" aria-label="LinkedIn"><Linkedin className="w-5 h-5" aria-hidden="true" /></a>
              <a href="#" className="text-white/70 hover:text-white transition-colors" aria-label="Twitter"><Twitter className="w-5 h-5" aria-hidden="true" /></a>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Services</h3>
            <ul className="space-y-3">
              {FOOTER_LINKS.services.map((link) => (
                <li key={link.label}><Link href={link.href} className="text-white/70 hover:text-white text-sm transition-colors">{link.label}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Company</h3>
            <ul className="space-y-3">
              {FOOTER_LINKS.company.map((link) => (
                <li key={link.label}><Link href={link.href} className="text-white/70 hover:text-white text-sm transition-colors">{link.label}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Resources</h3>
            <ul className="space-y-3">
              {FOOTER_LINKS.resources.map((link) => (
                <li key={link.label}><Link href={link.href} className="text-white/70 hover:text-white text-sm transition-colors">{link.label}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Contact</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start"><Phone className="w-4 h-4 text-brand-green mr-3 mt-0.5 flex-shrink-0" aria-hidden="true" /><a href={`tel:${CONTACT.phone.replace(/[^+\d]/g, '')}`} className="text-white/70 hover:text-white transition-colors">{CONTACT.phone}</a></li>
              <li className="flex items-start"><Mail className="w-4 h-4 text-brand-green mr-3 mt-0.5 flex-shrink-0" aria-hidden="true" /><a href={`mailto:${CONTACT.email}`} className="text-white/70 hover:text-white transition-colors">{CONTACT.email}</a></li>
              <li className="flex items-start"><MapPin className="w-4 h-4 text-brand-green mr-3 mt-0.5 flex-shrink-0" aria-hidden="true" /><span className="text-white/70">{CONTACT.location}</span></li>
            </ul>
          </div>
        </div>
        <div className="pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-white/60">
          <p>&copy; {currentYear} {BRAND.name} Solutions. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            {FOOTER_LINKS.legal.map((link) => (
              <Link key={link.label} href={link.href} className="hover:text-white transition-colors">{link.label}</Link>
            ))}
          </div>
        </div>
      </Container>
    </footer>
  );
}