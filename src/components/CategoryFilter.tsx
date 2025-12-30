import { useState } from 'react';
import { categories } from '@/lib/menuData';
import { cn } from '@/lib/utils';

interface CategoryFilterProps {
  selected: string;
  onSelect: (category: string) => void;
}

export function CategoryFilter({ selected, onSelect }: CategoryFilterProps) {
  return (
    <div className="sticky top-0 z-20 -mx-4 bg-background/80 px-4 py-3 backdrop-blur-lg">
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onSelect(category.id)}
            className={cn(
              'flex shrink-0 items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition-all duration-200',
              selected === category.id
                ? 'bg-primary text-primary-foreground shadow-glow'
                : 'bg-secondary text-secondary-foreground hover:bg-primary/10'
            )}
          >
            <span className="text-base">{category.icon}</span>
            {category.name}
          </button>
        ))}
      </div>
    </div>
  );
}
