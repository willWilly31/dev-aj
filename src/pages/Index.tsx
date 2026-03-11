import { useState, useMemo, useEffect, lazy, Suspense } from 'react';
import { Header } from '@/components/Header';
import { CategoryFilter } from '@/components/CategoryFilter';
import { MenuCard } from '@/components/MenuCard';
import { MenuGridSkeleton } from '@/components/MenuCardSkeleton';
import { CartFloatingButton } from '@/components/CartFloatingButton';
import { HeroCarousel } from '@/components/HeroCarousel';
import { menuItems } from '@/lib/menuData';
import { Search, X } from 'lucide-react';

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      const q = searchQuery.toLowerCase();
      const matchesSearch = item.name.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const popularItems = menuItems.filter((item) => item.popular);

  return (
    <div className="min-h-screen bg-background pb-28">
      <Header />

      <main className="container px-4 py-4 sm:py-6 max-w-5xl mx-auto">
        {/* Hero Carousel */}
        <HeroCarousel />

        {/* Search Bar */}
        <div className="relative mb-4 sm:mb-6">
          <Search className="absolute left-3 sm:left-4 top-1/2 h-4 w-4 sm:h-5 sm:w-5 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Cari menu favoritmu..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-2xl border border-border/50 bg-card py-3 sm:py-4 pl-10 sm:pl-12 pr-10 text-sm sm:text-base text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all shadow-card font-light"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Categories */}
        <CategoryFilter selected={selectedCategory} onSelect={setSelectedCategory} />

        {/* Popular Section */}
        {selectedCategory === 'all' && !searchQuery && (
          <section className="mb-6 sm:mb-8 mt-4 sm:mt-6">
            <div className="flex items-center gap-3 mb-4 sm:mb-5">
              <div className="w-1 h-5 sm:h-6 rounded-full gradient-warm" />
              <h3 className="font-display text-lg sm:text-xl text-foreground tracking-tight">Paling Diminati</h3>
            </div>
            {loading ? (
              <MenuGridSkeleton count={4} />
            ) : (
              <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
                {popularItems.slice(0, 4).map((item) => (
                  <MenuCard key={item.id} item={item} />
                ))}
              </div>
            )}
          </section>
        )}

        {/* All Menu */}
        <section className="mt-6 sm:mt-8">
          <div className="flex items-center gap-3 mb-4 sm:mb-5">
            <div className="w-1 h-5 sm:h-6 rounded-full bg-muted-foreground/30" />
            <h3 className="font-display text-lg sm:text-xl text-foreground tracking-tight">
              {selectedCategory === 'all' ? 'Semua Menu' : 'Menu Pilihan'}
            </h3>
            <span className="ml-auto text-xs text-muted-foreground">{filteredItems.length} menu</span>
          </div>
          {loading ? (
            <MenuGridSkeleton count={8} />
          ) : filteredItems.length > 0 ? (
            <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 stagger-children">
              {filteredItems.map((item) => (
                <MenuCard key={item.id} item={item} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 sm:py-16 text-center">
              <span className="text-4xl sm:text-5xl">🍜</span>
              <p className="mt-3 sm:mt-4 text-base sm:text-lg font-semibold text-foreground">Menu tidak ditemukan</p>
              <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
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