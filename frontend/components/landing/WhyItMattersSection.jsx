'use client';

import { useEffect, useRef } from 'react';

const impactItems = [
  {
    stat: '40%',
    statLabel: 'of food produced is wasted',
    title: 'Reduce Food Waste',
    description:
      'India wastes over 68 million tonnes of food every year — enough to feed every hungry person in the country. AnnSeva intercepts this waste before it reaches the landfill.',
    color: '#16A34A',
    bg: '#F0FDF4',
    border: '#BBF7D0',
  },
  {
    stat: '190M',
    statLabel: 'Indians go to bed hungry',
    title: 'Help Communities',
    description:
      'Surplus food from restaurants and events reaches shelters, orphanages, and daily-wage workers who need it most — quickly, safely, and with dignity.',
    color: '#E63327',
    bg: '#FFF5F5',
    border: '#FFD0C0',
  },
  {
    stat: '< 15 min',
    statLabel: 'average response time',
    title: 'Faster Redistribution',
    description:
      'Traditional food redistribution takes hours of phone calls and coordination. With AnnSeva, the average time from listing to NGO response is under 15 minutes.',
    color: '#7C3AED',
    bg: '#F5F3FF',
    border: '#DDD6FE',
  },
];

const testimonials = [
  {
    name: 'Priya Sharma',
    role: 'Manager, Hotel Sunrise Bengaluru',
    quote: 'We used to throw away 50+ meals every day after events. AnnSeva helped us connect with 3 nearby NGOs within the first week. It feels amazing to know that food is going to people who need it.',
    avatar: 'PS',
  },
  {
    name: 'Rajan Mehta',
    role: 'Volunteer, Asha Foundation Mumbai',
    quote: 'Before AnnSeva, finding food for our daily meals was a challenge that took all morning. Now I get notified on my phone and can collect food for 200 people within an hour.',
    avatar: 'RM',
  },
  {
    name: 'Anita Kapoor',
    role: 'Chef-Owner, Spice Route Delhi',
    quote: 'The platform is incredibly easy to use. I post leftover food in 2 minutes, and it is always collected before it expires. My staff feels proud to be part of something like this.',
    avatar: 'AK',
  },
];

export default function WhyItMattersSection() {
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
      { threshold: 0.08 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="why-it-matters" ref={sectionRef} className="py-24 lg:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">

        {/* ── Header ── */}
        <div className="text-center mb-16 reveal">
          <span className="section-label">💡 Why It Matters</span>
          <h2 className="section-title">
            The Problem Is Real.<br />
            <span className="gradient-text">So Is Our Solution.</span>
          </h2>
          <p className="section-subtitle mx-auto">
            Food waste and hunger can coexist only because of a missing link — a real-time
            coordination system. AnnSeva is that link.
          </p>
        </div>

        {/* ── Impact Cards ── */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {impactItems.map((item, i) => (
            <div
              key={item.title}
              className="impact-card reveal"
              style={{
                transitionDelay: `${i * 120}ms`,
                backgroundColor: item.bg,
                borderColor: item.border,
              }}
            >
              {/* Big Stat */}
              <div
                className="text-4xl lg:text-5xl font-black mb-1"
                style={{ color: item.color }}
              >
                {item.stat}
              </div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted mb-5">
                {item.statLabel}
              </p>

              {/* Title */}
              <h3 className="text-xl font-bold text-dark mb-3">{item.title}</h3>
              <p className="text-muted text-sm leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>

        {/* ── Problem Statement ── */}
        <div
          className="rounded-3xl p-8 lg:p-12 mb-20 reveal"
          style={{ background: 'linear-gradient(135deg, #FFF8F5 0%, #FFF0EB 100%)', border: '1px solid #FFD0C0' }}
        >
          <div className="max-w-3xl mx-auto text-center">
            <h3 className="text-2xl lg:text-3xl font-bold text-dark mb-5">
              The Core Problem
            </h3>
            <p className="text-muted leading-relaxed text-base lg:text-lg">
              Every day, large amounts of clean, edible food are wasted by restaurants, hotels, and
              mess facilities — especially after events or daily operations. At the same time, NGOs,
              shelters, and individuals face difficulty accessing sufficient food for those in need.
              The core problem is the <strong className="text-dark">lack of a real-time, reliable
              coordination system</strong> between food donors and recipients. Food often goes to
              waste not because it is unusable, but because there is no fast, structured way to
              discover, verify, and distribute it before it expires.
            </p>
          </div>
        </div>

        {/* ── Testimonials ── */}
        <div className="reveal">
          <p className="text-center text-sm font-bold uppercase tracking-widest text-muted mb-10">
            Real Stories. Real Impact.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div
                key={t.name}
                className="bg-gray-50 rounded-2xl p-6 border border-gray-100 hover:shadow-md hover:-translate-y-1 transition-all duration-300 reveal"
                style={{ transitionDelay: `${i * 120}ms` }}
              >
                {/* Quote marks */}
                <div className="text-4xl font-black text-primary/20 leading-none mb-3">"</div>
                <p className="text-dark text-sm leading-relaxed mb-6 italic">
                  {t.quote}
                </p>
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                    style={{ background: 'linear-gradient(135deg, #E84E0F, #FF6B35)' }}
                  >
                    {t.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-dark text-sm">{t.name}</p>
                    <p className="text-muted text-xs">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
