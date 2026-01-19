import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Classes from '@/components/Classes';
import Pricing from '@/components/Pricing';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main className="nd-main">
      <div className="nd-global-glow" aria-hidden="true" />
      <div className="nd-global-noise" aria-hidden="true" />
      <Navbar />
      <Hero />
      <About />
      <Classes />
      <Pricing />
      <Contact />
      <Footer />
    </main>
  );
}