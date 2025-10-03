import { useLanguage } from '@/contexts/LanguageContext';
import { categories } from '@shared/schema';

interface CategoryCircleProps {
  category: typeof categories[number];
  onClick?: () => void;
}

export default function CategoryCircle({ category, onClick }: CategoryCircleProps) {
  const { language } = useLanguage();

  const getName = () => {
    if (language === 'fa') return category.nameFA;
    if (language === 'ps') return category.namePS;
    return category.nameEN;
  };

  return (
    <div
      onClick={onClick}
      className="flex flex-col items-center gap-2 cursor-pointer group min-w-[80px] md:min-w-[100px]"
      data-testid={`category-${category.id}`}
    >
      <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-card to-primary/10 border-2 border-border flex items-center justify-center text-3xl md:text-4xl transition-all duration-300 hover-elevate active-elevate-2 group-hover:scale-105 group-hover:border-primary shadow-sm">
        {category.icon}
      </div>
      <span className="text-xs md:text-sm font-medium text-center text-foreground group-hover:text-primary transition-colors">
        {getName()}
      </span>
    </div>
  );
}
