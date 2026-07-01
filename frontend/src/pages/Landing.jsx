import { useEffect } from 'react';
import Navbar from '../components/landing/Navbar';
import HeroSection from '../components/landing/HeroSection';
import TrustSection from '../components/landing/TrustSection';
import AboutSection from '../components/landing/AboutSection';
import FeaturesSection from '../components/landing/FeaturesSection';
import WorkflowSection from '../components/landing/WorkflowSection';
import StatsSection from '../components/landing/StatsSection';
import ComparisonSection from '../components/landing/ComparisonSection';
import ScreenshotsSection from '../components/landing/ScreenshotsSection';
import WhyChooseSection from '../components/landing/WhyChooseSection';
import TestimonialsSection from '../components/landing/TestimonialsSection';
import FAQSection from '../components/landing/FAQSection';
import CTASection from '../components/landing/CTASection';
import Footer from '../components/landing/Footer';

export default function Landing() {
  useEffect(() => {
    document.title = 'SolarIQ — Smart Solar Energy Prediction, Monitoring & Optimization';
    // Override body background for landing page
    const prevBg = document.body.style.background;
    document.body.style.background = '#020B14';
    document.body.style.overflowX = 'hidden';
    return () => {
      document.body.style.background = prevBg;
      document.body.style.overflowX = '';
    };
  }, []);

  return (
    <div style={{ background: '#020B14', color: '#F1F5F9', fontFamily: '"Plus Jakarta Sans", Inter, sans-serif', minHeight: '100vh', overflowX: 'hidden' }}>
      <Navbar />
      <main>
        <HeroSection />
        <TrustSection />
        <AboutSection />
        <FeaturesSection />
        <WorkflowSection />
        <StatsSection />
        <ComparisonSection />
        <ScreenshotsSection />
        <WhyChooseSection />
        <TestimonialsSection />
        <FAQSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
