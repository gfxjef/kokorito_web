import Header from '@/components/Header';
import HeroCarousel from '@/components/HeroCarousel';
import BestSellers from '@/components/BestSellers';
import CategoriesGrid from '@/components/CategoriesGrid';
import CustomerStories from '@/components/CustomerStories';
import Footer from '@/components/Footer';
import DebugGlobalData from '@/components/DebugGlobalData';

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Main Content - Full Width */}
      <main>
        <HeroCarousel />
        <BestSellers />
        <CategoriesGrid />
        <CustomerStories />
      </main>
      
      <Footer />
      
      {/* Debug component - remover en producción */}
      <DebugGlobalData />
    </div>
  );
} 