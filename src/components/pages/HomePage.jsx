import HeroSection from '../home/HeroSection';
import CategorySection from '../home/CategorySection';
import FeaturedProductsSection from '../home/FeaturedProductsSection';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">

      <HeroSection />
      <CategorySection />
      <FeaturedProductsSection />
    </div>
  );
}
