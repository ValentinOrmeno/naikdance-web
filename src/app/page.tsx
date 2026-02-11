import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Classes from '@/components/Classes';
// import Schedule from '@/components/Schedule'; // Comentado - datos hardcodeados, reemplazado por Instagram
// import InstagramFeed from '@/components/InstagramFeed'; // Comentado - sección de Instagram removida
import Pricing from '@/components/Pricing';
import TeachersGrid from '@/components/TeachersGrid';
import FAQ from '@/components/FAQ';
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
      {/* <Schedule /> */} {/* Comentado - datos hardcodeados */}
      {/* <InstagramFeed /> */} {/* Comentado - sección de Instagram removida */}
      <Pricing />
      <TeachersGrid />
      <FAQ />
      <Contact />
      <Footer />
    </main>
  );
}