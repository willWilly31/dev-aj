import { useState, useMemo, useEffect } from 'react';
import { Header } from '@/components/Header';
import { CategoryFilter } from '@/components/CategoryFilter';
import { MenuCard } from '@/components/MenuCard';
import { MenuGridSkeleton } from '@/components/MenuCardSkeleton';
import { CartFloatingButton } from '@/components/CartFloatingButton';
import { HeroCarousel } from '@/components/HeroCarousel';
import { menuItems } from '@/lib/menuData';
import { Search } from 'lucide-react';

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const popularItems = menuItems.filter((item) => item.popular);

  return (
    <div className="min-h-screen bg-background pb-28">
      <Header />

      <main className="container py-6">
        {/* Hero Carousel */}
        <HeroCarousel />

        {/* Search Bar */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Cari menu favoritmu..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-2xl border border-border/50 bg-card py-4 pl-12 pr-4 text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all shadow-card font-light"
          />
        </div>

        {/* Categories */}
        <CategoryFilter selected={selectedCategory} onSelect={setSelectedCategory} />

        {/* Popular Section */}
        {selectedCategory === 'all' && !searchQuery && (
          <section className="mb-8 mt-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-1 h-6 rounded-full gradient-warm" />
              <h3 className="font-display text-xl text-foreground tracking-tight">Paling Diminati</h3>
            </div>
            {loading ? (
              <MenuGridSkeleton count={4} />
            ) : (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {popularItems.slice(0, 4).map((item) => (
                  <MenuCard key={item.id} item={item} />
                ))}
              </div>
            )}
          </section>
        )}

        {/* All Menu */}
        <section className="mt-8">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-1 h-6 rounded-full bg-muted-foreground/30" />
            <h3 className="font-display text-xl text-foreground tracking-tight">
              {selectedCategory === 'all' ? 'Semua Menu' : 'Menu Pilihan'}
            </h3>
          </div>
          {loading ? (
            <MenuGridSkeleton count={8} />
          ) : filteredItems.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 stagger-children">
              {filteredItems.map((item) => (
                <MenuCard key={item.id} item={item} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <span className="text-5xl">🍜</span>
              <p className="mt-4 text-lg font-semibold text-foreground">Menu tidak ditemukan</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Coba cari dengan kata kunci lain
              </p>
            </div>
          )}
        </section>
      </main>

      <CartFloatingButton />
    </div>
  );
};

export default Index;
