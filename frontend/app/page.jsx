import Navbar                from '@/components/landing/Navbar';
import HeroSection           from '@/components/landing/HeroSection';
import StatsSection          from '@/components/landing/StatsSection';
import ServicesSection       from '@/components/landing/ServicesSection';
import HowItWorksSection     from '@/components/landing/HowItWorksSection';
import WhyItMattersSection   from '@/components/landing/WhyItMattersSection';
import FloatingImpactSection from '@/components/landing/FloatingImpactSection';
import FooterSection         from '@/components/landing/FooterSection';

export default function LandingPage() {
  return (
    <main>
      <Navbar />
      <HeroSection />
      <StatsSection />
      <ServicesSection />
      <HowItWorksSection />
      <WhyItMattersSection />
      <FloatingImpactSection />
      <FooterSection />
    </main>
  );
}
