import dynamic from 'next/dynamic';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Footer from '@/components/Footer';

// Below-the-fold: lazy load para reducir JS inicial (FCP/LCP)
const About = dynamic(() => import('@/components/About'), { ssr: true });
const Classes = dynamic(() => import('@/components/Classes'), { ssr: true });
const Schedule = dynamic(() => import('@/components/Schedule'), { ssr: true });
const SpecialClasses = dynamic(() => import('@/components/SpecialClasses'), { ssr: true });
const PricingSummary = dynamic(() => import('@/components/PricingSummary'), { ssr: true });
const TeachersGrid = dynamic(() => import('@/components/TeachersGrid'), { ssr: true });
const FAQ = dynamic(() => import('@/components/FAQ'), { ssr: true });
const Contact = dynamic(() => import('@/components/Contact'), { ssr: true });

export default function Home() {
  return (
    <main className="nd-main overflow-x-hidden min-w-0 bg-naik-black">
      <Navbar />
      <Hero />
      <About />
      <SpecialClasses />
      <Classes />
      <Schedule />
      <PricingSummary />
      <TeachersGrid />
      <FAQ />
      <Contact />
      <Footer />
    </main>
  );
}