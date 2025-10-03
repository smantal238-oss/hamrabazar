import CategoryCircle from '../CategoryCircle';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { categories } from '@shared/schema';

export default function CategoryCircleExample() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <div className="p-8 flex gap-4">
          <CategoryCircle 
            category={categories[0]} 
            onClick={() => console.log('Clicked:', categories[0].id)} 
          />
          <CategoryCircle 
            category={categories[1]} 
            onClick={() => console.log('Clicked:', categories[1].id)} 
          />
        </div>
      </LanguageProvider>
    </ThemeProvider>
  );
}
