export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  gradient: 'green' | 'blue';
  href?: string;
}

export interface Industry {
  id: string;
  name: string;
  icon: string;
  useCases: string[];
  clientCount: string;
  gradient: 'green' | 'blue';
}

export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  role: string;
  company: string;
  initials: string;
  gradient: 'green' | 'blue';
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
}

export interface Statistic {
  id: string;
  value: number;
  suffix: string;
  label: string;
  sublabel: string;
  decimals?: number;
}

export interface NavItem {
  label: string;
  href: string;
  children?: { label: string; href: string }[];
}

export interface ProcessStep {
  step: number;
  title: string;
  description: string;
  icon: string;
}

export interface ProofPoint {
  label: string;
  detail: string;
}

export interface PilotScopeItem {
  title: string;
  description: string;
}
