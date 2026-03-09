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
    <section className="relative mb-8 rounded-3xl overflow-hidden h-52 sm:h-64 md:h-72 shadow-lg border border-border/20">
      {/* Image Carousel */}
      {heroImages.map((src, index) => (
        <img
          key={index}
          src={src}
          alt={`Suasana Warkop AJ ${index + 1}`}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
            index === currentIndex ? 'opacity-100' : 'opacity-0'
          }`}
          loading={index === 0 ? 'eager' : 'lazy'}
        />
      ))}
      
      {/* Elegant gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
      
      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-end px-6 pb-6 z-10">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.2em] text-white/70 font-medium">
            Ngopi Santai, Rasa Istimewa
          </p>
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl leading-tight text-balance text-white">
            Warkop <span className="text-gold">AJ</span>
          </h2>
          <p className="text-sm sm:text-base text-white/80 max-w-md font-light">
            Kopi, teh, dan makanan khas warkop Medan
          </p>
        </div>
      </div>

      {/* Premium Carousel Indicators */}
      <div className="absolute bottom-4 right-6 flex gap-1.5 z-10">
        {heroImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-1 rounded-full transition-all duration-500 ${
              index === currentIndex 
                ? 'bg-white w-8' 
                : 'bg-white/40 w-4 hover:bg-white/60'
            }`}
            aria-label={`Slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
};
