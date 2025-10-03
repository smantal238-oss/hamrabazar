import ListingCard from '../ListingCard';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { ThemeProvider } from '@/contexts/ThemeContext';

export default function ListingCardExample() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <div className="p-8 max-w-sm">
          <ListingCard
            id="1"
            title="تویوتا کرولا مدل ۲۰۲۰"
            price={25000}
            category="vehicles"
            city="kabul"
            createdAt={new Date(Date.now() - 3600000).toISOString()}
            onClick={() => console.log('Card clicked')}
          />
        </div>
      </LanguageProvider>
    </ThemeProvider>
  );
}
