import CityCircle from '../CityCircle';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { cities } from '@shared/schema';

export default function CityCircleExample() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <div className="p-8 flex gap-4">
          <CityCircle 
            city={cities[0]} 
            onClick={() => console.log('Clicked:', cities[0].id)} 
          />
          <CityCircle 
            city={cities[1]} 
            onClick={() => console.log('Clicked:', cities[1].id)} 
          />
        </div>
      </LanguageProvider>
    </ThemeProvider>
  );
}
