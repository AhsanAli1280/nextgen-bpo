# NextGen BPO Solutions — Project Record

**Date completed:** June 2026  
**Live URL:** https://next-genbpo.com  
**Vercel URL:** https://nextgen-bpo.vercel.app  
**Project folder:** `C:\Users\ahsan\nextgen-bpo`

---

## Business Context

NextGen BPO Solutions is a CA-led accounting, taxation and back-office outsourcing firm serving:

- CPA firms and accounting practices
- Audit firms
- Tax practices
- Small and medium businesses
- Growing companies
- International clients (US, UK, Pakistan)

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Animations | Framer Motion |
| Icons | Lucide React |
| Fonts | Inter, JetBrains Mono (Google Fonts) |
| Deployment | Vercel |
| Domain | GoDaddy (next-genbpo.com) |
| Contact form | Web3Forms |
| Logo format | SVG (transparent, full colour) |

---

## Deployment

### Vercel

- Project name: `nextgen-bpo`
- Project ID: `prj_VGCOMzzBb0tgtp47jNF0sh1UUL82`
- Team: `muhammadahsanali1280-9998s-projects`

To deploy new changes:

```bash
cd C:\Users\ahsan\nextgen-bpo
npx vercel deploy --prod --yes
```

### Domain (GoDaddy)

Domain: `next-genbpo.com`

Required DNS records in GoDaddy:

| Type | Name | Value |
|------|------|-------|
| A | @ | 76.76.21.21 |
| CNAME | www | cname.vercel-dns.com |

SSL is handled automatically by Vercel.

---

## Contact Form

Provider: Web3Forms (https://web3forms.com)  
Access key: `53822685-7996-4114-852a-720cd99fc38d`  
Delivery email: `info@next-genbpo.com`  
Form name: NextGen BPO - Website Enquiries  
Free tier: 250 submissions/month

Submissions arrive in the inbox with subject: "New Enquiry - NextGen BPO Solutions Website"

---

## Services

### Homepage services (10 total)

| Service | SEO Page |
|---------|---------|
| Accounting Outsourcing | /accounting-outsourcing |
| Bookkeeping Services | /bookkeeping |
| Payroll Processing | /payroll |
| Financial Reporting | — |
| CPA Firm Support | /cpa-outsourcing |
| Audit Firm Support | — |
| US Tax Preparation Support | /us-tax-preparation |
| Pakistan Taxation Services | /pakistan-taxation |
| Offshore Accounting Staffing | — |
| Corporate Advisory | — |

Services without a dedicated page link to the contact section.

---

## Project Structure

```
nextgen-bpo/
├── app/
│   ├── layout.tsx                    # Root layout, metadata, fonts
│   ├── page.tsx                      # Homepage
│   ├── globals.css                   # Global styles, design tokens
│   ├── sitemap.ts                    # XML sitemap (7 routes)
│   ├── robots.ts                     # Robots.txt
│   ├── accounting-outsourcing/page.tsx
│   ├── bookkeeping/page.tsx
│   ├── payroll/page.tsx
│   ├── cpa-outsourcing/page.tsx
│   ├── us-tax-preparation/page.tsx
│   └── pakistan-taxation/page.tsx
├── components/
│   ├── layout/
│   │   ├── navbar.tsx                # Fixed nav, smooth scroll, logo
│   │   ├── footer.tsx                # Footer with legal modal
│   │   └── mobile-menu.tsx           # Slide-in mobile nav
│   ├── sections/
│   │   ├── hero.tsx                  # Homepage hero
│   │   ├── trusted-by.tsx            # Trust pills and proof points
│   │   ├── services-grid.tsx         # 10-service grid
│   │   ├── why-choose-us.tsx         # 4 value propositions
│   │   ├── process-workflow.tsx      # 4-step process
│   │   ├── industry-expertise.tsx    # 4 industry cards
│   │   ├── statistics.tsx            # 4 trust statement cards
│   │   ├── testimonials.tsx          # 3 client testimonials
│   │   ├── faq.tsx                   # 5 accordion FAQs
│   │   ├── leadership.tsx            # Our Team section
│   │   ├── cta-banner.tsx            # Contact form (Web3Forms)
│   │   └── service-page-layout.tsx   # Shared service page template
│   └── ui/
│       ├── button.tsx
│       ├── container.tsx
│       ├── section-heading.tsx
│       ├── service-card.tsx
│       ├── testimonial-card.tsx
│       ├── glass-card.tsx
│       ├── animated-counter.tsx
│       └── legal-modal.tsx           # Privacy Policy + Terms modal
├── lib/
│   ├── constants.ts                  # Brand, contact, SEO, slugs
│   ├── animations.ts                 # Framer Motion variants
│   ├── utils.ts                      # cn(), getGradientClasses()
│   └── data/
│       ├── navigation.ts             # Nav items, footer links
│       ├── services.ts               # 10 service definitions
│       ├── service-pages.ts          # Full service page content (6 pages)
│       ├── process.ts                # 4 process steps
│       ├── industries.ts             # 4 industry cards
│       ├── statistics.ts             # 4 trust statements
│       ├── testimonials.ts           # 3 testimonials
│       ├── faqs.ts                   # 5 FAQs
│       └── proof.ts                  # Trust pills and proof points
├── types/
│   └── index.ts                      # TypeScript interfaces
├── public/
│   ├── logo.svg                      # Full colour SVG logo
│   └── logo.png                      # Original PNG (kept as fallback)
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── netlify.toml
```

---

## Design System

### Colours

| Token | Hex |
|-------|-----|
| brand-green | #39B54A |
| brand-blue | #3F6FB6 |
| brand-dark | #0F172A |
| brand-gray | #64748B |
| brand-light | #F8FAFC |
| brand-border | #E2E8F0 |

### Section spacing

| Type | Class |
|------|-------|
| Hero | pt-32 pb-20 lg:pt-40 lg:pb-28 |
| Accent sections | py-16 lg:py-20 |
| Main sections | py-20 lg:py-28 |
| CTA section | py-20 lg:py-24 |

### Card standards

- Border radius: `rounded-2xl`
- Padding: `p-6`
- Shadow at rest: `shadow-sm`
- Shadow on hover: `hover:shadow-md`
- Gap in grids: `gap-6`

### Scroll behaviour

- CSS: `scroll-behavior: smooth` on `html`
- Padding: `scroll-padding-top: 88px` (accounts for fixed navbar)
- Navbar hash links use explicit `scrollIntoView({ behavior: 'smooth' })`

---

## Navigation

### Navbar items (in page order)

| Label | Anchor | Section component |
|-------|--------|------------------|
| Services | #services | ServicesGrid |
| About | #about | WhyChooseUs |
| Process | #process | ProcessWorkflow |
| Industries | #industries | IndustryExpertise |
| Our Team | #our-team | Leadership |

CTA button: Request Consultation → #contact

---

## SEO Status

**Current rating: 6/10**

### Implemented

- Meta title and description on all 7 pages
- Open Graph and Twitter card metadata
- Canonical base URL: https://next-genbpo.com
- XML sitemap with all 7 routes
- robots.ts
- Semantic HTML (H1/H2/H3 hierarchy)
- Alt text on all images
- Mobile responsive
- Next.js SSR (fully crawlable)
- SVG favicon

### Not yet implemented

- JSON-LD structured data (Organization, ProfessionalService, FAQPage)
- Google Search Console verification
- Google Analytics
- FAQ schema markup
- Blog / content strategy
- Backlink building
- hreflang tags for multi-region targeting
- LinkedIn and Twitter profile links (currently placeholder)

---

## Legal

### Privacy Policy and Terms of Engagement

Both are implemented as in-page modals (no separate pages). Content is placeholder. Full legal text should be added before the site is actively marketed.

Access: Footer bottom bar → Privacy Policy / Terms of Engagement buttons.

To update content, edit: `components/ui/legal-modal.tsx`

---

## Key Contacts

| Field | Value |
|-------|-------|
| Business email | info@next-genbpo.com |
| Phone | +92-328-4000-398 |
| Location | Pakistan |

---

## Making Future Changes

### Update any text or content

All website content lives in `lib/data/`. Edit the relevant file:

- Services: `lib/data/services.ts`
- FAQs: `lib/data/faqs.ts`
- Testimonials: `lib/data/testimonials.ts`
- Process steps: `lib/data/process.ts`
- Trust statements: `lib/data/statistics.ts`
- Trust pills: `lib/data/proof.ts`
- Service page content: `lib/data/service-pages.ts`
- Contact details / brand: `lib/constants.ts`

### Add a new service page

1. Add content to `lib/data/service-pages.ts`
2. Create `app/[slug]/page.tsx` importing from service-pages.ts
3. Add the route to `app/sitemap.ts`
4. Add the service to `lib/data/services.ts` with the href

### Update the logo

Replace `public/logo.svg` with the new file. Keep the same filename. The logo is referenced in navbar and footer.

### Update form delivery email

Log in to web3forms.com and update the email on the form dashboard. The access key does not change.

### Deploy after any change

```bash
cd C:\Users\ahsan\nextgen-bpo
npx vercel deploy --prod --yes
```

---

## Recommended Next Steps

1. Connect domain in Vercel and update GoDaddy DNS
2. Submit sitemap to Google Search Console
3. Add JSON-LD structured data for Organisation and FAQPage schema
4. Add real founder/team credentials to the Our Team section
5. Replace placeholder LinkedIn and Twitter links with real profiles
6. Write 3-4 blog articles targeting key search terms
7. Set up Google Analytics
8. Complete Privacy Policy and Terms of Engagement legal text
9. Create Audit Firm Support and Offshore Accounting Staffing service pages
10. Consider adding hreflang tags for US, UK and Pakistan targeting
