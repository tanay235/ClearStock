'use client';

import { useEffect, useRef } from 'react';

const services = [
  {
    id: 'donate',
    tag: 'For Donors',
    title: 'Donate Surplus Food',
    description:
      'Restaurants, hotels, mess facilities, and event organizers can list surplus food in minutes. Add quantity, type, expiry time, and pickup location — and let nearby NGOs discover it instantly.',
    features: [
      'Quick listing in under 2 minutes',
      'Veg / Non-veg classification',
      'Set expiry countdown',
      'Real-time pickup status',
    ],
    cta: 'Start Donating',
    href: '#',
  },
  {
    id: 'find',
    tag: 'For Receivers',
    title: 'Find Food Near You',
    description:
      'NGOs, shelters, and volunteers can browse available food listings on an interactive map, filter by type, quantity, and urgency, and request food with a single click.',
    features: [
      'Live map with nearby listings',
      'Filter by type, quantity, urgency',
      'One-tap food request',
      'Pickup tracking & history',
    ],
    cta: 'Find Food Now',
    href: '#',
  },
];

const additionalCards = [
  {
    title: 'AI-Powered Matching',
    description: 'Our AI engine ranks food listings by expiry risk, quantity, and distance to suggest the best match for each NGO automatically.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#E63327" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
      </svg>
    ),
  },
  {
    title: 'Live Map View',
    description: 'See all active food listings and NGOs on an interactive map. Know exactly where food is available and how far it is.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#E63327" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="3 11 22 2 13 21 11 13 3 11"/>
      </svg>
    ),
  },
  {
    title: 'Instant Alerts',
    description: 'Nearby NGOs get notified the moment a donor posts food. No more manual coordination — time-sensitive donations reach the right hands.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#E63327" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
        <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
      </svg>
    ),
  },
  {
    title: 'Expiry Countdown',
    description: 'Every listing shows a live countdown to expiry. Urgent listings are highlighted to ensure zero food goes to waste.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#E63327" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
      </svg>
    ),
  },
];

export default function ServicesSection() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll('.reveal').forEach((el) => el.classList.add('visible'));
          }
        });
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="services" ref={sectionRef} className="py-24 lg:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">

        {/* ── Header ── */}
        <div className="text-center mb-16 reveal">
          <span className="section-label">Our Services</span>
          <h2 className="section-title">
            One Platform,{' '}
            <span className="gradient-text">Two Powerful Roles</span>
          </h2>
          <p className="section-subtitle mx-auto">
            Whether you have food to give or food to find, AnnSeva makes the process
            fast, transparent, and impactful.
          </p>
        </div>

        {/* ── Main Service Cards ── */}
        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          {services.map((service, i) => (
            <div
              key={service.id}
              className="service-card reveal"
              style={{ transitionDelay: `${i * 150}ms` }}
            >
              <div className="section-label w-fit mb-5">{service.tag}</div>

              <h3 className="text-2xl font-bold text-dark leading-tight mb-4">
                {service.title}
              </h3>

              <p className="text-muted leading-relaxed mb-6 text-base">
                {service.description}
              </p>

              <ul className="space-y-3 mb-8">
                {service.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-sm text-dark">
                    <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                        <path d="M2 6l3 3 5-5" stroke="#E63327" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    {feature}
                  </li>
                ))}
              </ul>

              <a href={service.href} className="btn-primary">
                {service.cta} →
              </a>
            </div>
          ))}
        </div>

        {/* ── Additional Feature Cards ── */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {additionalCards.map((card, i) => (
            <div
              key={card.title}
              className="bg-gray-50 border border-gray-100 rounded-2xl p-6 group hover:bg-white hover:shadow-lg hover:-translate-y-2 transition-all duration-400 reveal"
              style={{ transitionDelay: `${(i + 2) * 100}ms` }}
            >
              <div className="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center mb-4 group-hover:border-primary/20 transition-colors duration-300 shadow-sm">
                {card.icon}
              </div>
              <h4 className="font-bold text-dark mb-2 text-base">{card.title}</h4>
              <p className="text-muted text-sm leading-relaxed">{card.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
