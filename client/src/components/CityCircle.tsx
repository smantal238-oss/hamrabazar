import { useLanguage } from '@/contexts/LanguageContext';
import { cities } from '@shared/schema';

interface CityCircleProps {
  city: typeof cities[number];
  onClick?: () => void;
}

export default function CityCircle({ city, onClick }: CityCircleProps) {
  const { language } = useLanguage();

  const getName = () => {
    if (language === 'fa') return city.nameFA;
    if (language === 'ps') return city.namePS;
    return city.nameEN;
  };

  return (
    <div
      onClick={onClick}
      className="flex flex-col items-center gap-2 cursor-pointer group min-w-[80px] md:min-w-[100px]"
      data-testid={`city-${city.id}`}
    >
      <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-card to-accent/10 border-2 border-border flex items-center justify-center text-3xl md:text-4xl transition-all duration-300 hover-elevate active-elevate-2 group-hover:scale-105 group-hover:border-accent shadow-sm">
        {city.icon}
      </div>
      <span className="text-xs md:text-sm font-medium text-center text-foreground group-hover:text-accent transition-colors">
        {getName()}
      </span>
    </div>
  );
}
