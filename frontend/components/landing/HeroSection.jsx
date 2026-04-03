'use client';

import { useEffect, useRef } from 'react';

export default function HeroSection() {
  const videoRef = useRef(null);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.play().catch(() => {
      // autoplay blocked — poster image shows as fallback
    });
  }, []);

  return (
    <section id="home" className="relative h-screen min-h-[600px] flex flex-col items-center justify-center overflow-hidden">

      {/* ── Video Background ── */}
      <div className="hero-video-container">
        <video
          ref={videoRef}
          className="hero-video"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster="https://images.unsplash.com/photo-1593113565214-80afc4eb3a1f?w=1920&q=80"
        >
          {/* Mixkit / Pexels community food sharing videos */}
          <source src="https://assets.mixkit.co/videos/preview/mixkit-hands-serving-food-to-other-hands-4014-large.mp4" type="video/mp4" />
          <source src="https://videos.pexels.com/video-files/6980646/6980646-hd_1920_1080_25fps.mp4" type="video/mp4" />
        </video>
        <div className="hero-overlay" />
      </div>

      {/* ── Hero Content ── */}
      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">

        {/* Live badge removed */}

        {/* Headline */}
        <h1
          className="text-white font-extrabold leading-tight mb-6"
          style={{
            fontSize: 'clamp(2.4rem, 6vw, 5rem)',
            animation: 'fadeUp 0.7s ease-out 0.4s both',
          }}
        >
          Connecting Surplus Food<br />
          <span style={{ color: '#FF6347' }}>With Those Who Need</span><br />
          It Most
        </h1>

        {/* Subheadline */}
        <p
          className="text-white/80 text-lg lg:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
          style={{ animation: 'fadeUp 0.7s ease-out 0.6s both' }}
        >
          Every day, tons of edible food is wasted while thousands go hungry.
          AnnSeva bridges this gap —{' '}
          <strong className="text-white">in real time.</strong>
        </p>

        {/* CTA Buttons — no emojis */}
        <div
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
          style={{ animation: 'fadeUp 0.7s ease-out 0.8s both' }}
        >
          <a href="#" id="hero-donate-cta" className="btn-primary text-base px-9 py-4 shadow-lg shadow-primary/30">
            Donate Food
          </a>
          <a href="#" id="hero-find-cta" className="btn-outline text-base px-9 py-4">
            Find Food
          </a>
        </div>

        {/* Trust bar removed */}
      </div>
    </section>
  );
}
