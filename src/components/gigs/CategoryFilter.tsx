import { motion } from 'framer-motion';
import { Flame, type LucideIcon } from 'lucide-react';
import { GIG_CATEGORIES } from '@/lib/constants';

interface CategoryFilterProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export function CategoryFilter({ selectedCategory, onCategoryChange }: CategoryFilterProps) {
  const allCategories: { value: string; label: string; icon: LucideIcon }[] = [
    { value: 'all', label: 'All Gigs', icon: Flame },
    ...GIG_CATEGORIES,
  ];

  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {allCategories.map((cat) => {
        const Icon = cat.icon;
        return (
          <motion.button
            key={cat.value}
            onClick={() => onCategoryChange(cat.value)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
              selectedCategory === cat.value
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Icon className="w-4 h-4" />
            {cat.label}
          </motion.button>
        );
      })}
    </div>
  );
}
