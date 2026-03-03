import dynamic from 'next/dynamic';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const Pricing = dynamic(() => import('@/components/Pricing'), { ssr: true });

export default function ArancelesPage() {
  return (
    <main className="nd-main overflow-x-hidden min-w-0">
      <Navbar />
      <Pricing />
      <Footer />
    </main>
  );
}

