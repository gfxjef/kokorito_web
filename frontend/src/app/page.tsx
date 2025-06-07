import Header from '@/components/Header';
import PromoSlider from '@/components/PromoBanner';
import BestSellers from '@/components/BestSellers';
import CategoriesGrid from '@/components/CategoriesGrid';
import CustomerStories from '@/components/CustomerStories';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Main Content - Full Width */}
      <main>
        <PromoSlider />
        <BestSellers />
        <CategoriesGrid />
        <CustomerStories />
      </main>
      
      <Footer />
    </div>
  );
} 