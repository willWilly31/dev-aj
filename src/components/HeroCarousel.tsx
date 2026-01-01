import { useState, useEffect } from 'react';
import heroRural1 from '@/assets/hero-rural-cooking-1.jpg';
import heroRural2 from '@/assets/hero-rural-cooking-2.jpg';
import heroRural3 from '@/assets/hero-rural-cooking-3.jpg';

const heroImages = [heroRural1, heroRural2, heroRural3];

export const HeroCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative mb-6 rounded-2xl overflow-hidden h-48 sm:h-56 md:h-64">
      {/* Image Carousel */}
      {heroImages.map((src, index) => (
        <img
          key={index}
          src={src}
          alt={`Masakan tradisional ${index + 1}`}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
            index === currentIndex ? 'opacity-100' : 'opacity-0'
          }`}
          loading={index === 0 ? 'eager' : 'lazy'}
        />
      ))}
      
      {/* Overlay - 15% opacity */}
      <div className="absolute inset-0 bg-black/15" />
      
      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-center px-6 z-10">
        <h2 className="text-2xl sm:text-3xl font-extrabold leading-tight text-balance text-white drop-shadow-lg">
          Makanan Jalanan Medan 🔥
        </h2>
        <p className="mt-2 text-sm sm:text-base text-white/90 drop-shadow-md max-w-md">
          Pesan nasi goreng, mie ayam, dan kuliner khas Medan favoritmu!
        </p>
      </div>

      {/* Carousel Indicators */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {heroImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentIndex 
                ? 'bg-white w-6' 
                : 'bg-white/50 hover:bg-white/70'
            }`}
            aria-label={`Slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
};
